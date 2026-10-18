import { parseRadarViewSettings } from "../shared/radar-view-settings.mjs";

export async function startWebApplication(dependencies) {
  dependencies.loadEnvironment({ quiet: true });
  const port = validPort(process.env.PORT ?? "3000", "PORT");
  const feedPort = validPort(process.env.ADSB_PORT ?? "30003", "ADSB_PORT");
  const location = dependencies.parseAdsbLocation(process.env.ADSB_LAT, process.env.ADSB_LON);
  const elevationFeet = validElevation(process.env.ADSB_ALT ?? "300");
  const radarViewSettings = parseRadarViewSettings(process.env);
  const airportDatabase = dependencies.createAirportDatabase(process.env.NASR_DATABASE_PATH);
  const metarLookup = dependencies.createMetarLookup(
    dependencies.parseMetarStations(process.env.METAR_STATIONS),
  );
  const log = dependencies.createLogger({ level: process.env.LOG_LEVEL ?? "info" });
  dependencies.registerHandlers({ log });
  const feed = dependencies.createAircraftFeed({
    host: process.env.ADSB_HOST ?? "127.0.0.1",
    port: feedPort,
    locationLatitude: process.env.ADSB_LAT,
    locationLongitude: process.env.ADSB_LON,
    onError: (error) => log.warn(`ADS-B stream error: ${error.message}`),
  });
  const lookup = dependencies.createAdsbLolLookup();
  const enrichedFeed = dependencies.createAircraftEnrichmentFeed(feed, lookup);
  const remoteSource = dependencies.createAdsbLolRemoteSource({
    location,
    defaultRangeNm: radarViewSettings.defaultRangeNm,
    lookup,
    onError: (error) => log.warn(`ADSB.lol remote feed error: ${error.message}`),
  });
  const mergedFeed = dependencies.createMergedAircraftFeed(enrichedFeed, remoteSource);
  const app = await dependencies.createRadarServer({
    feed: mergedFeed,
    location,
    elevationFeet,
    ...radarViewSettings,
    airportDatabase,
    metarLookup,
  });
  let shutdownPromise;
  const shutdown = () => {
    if (shutdownPromise) return shutdownPromise;
    mergedFeed.close();
    enrichedFeed.close();
    feed.close();
    shutdownPromise = app.close().then(() => log.info("Web application stopped"));
    return shutdownPromise;
  };
  dependencies.registerSignals({ log, shutdownHook: shutdown });
  await app.listen({ host: "0.0.0.0", port });
  log.info(`Web application listening at TCP endpoint ${port}`);
  return { app, feed: mergedFeed, shutdown };
}

function validPort(value, name) {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`${name} must be an integer from 1 through 65535`);
  }
  return port;
}

function validElevation(value) {
  const elevation = Number(value);
  if (!Number.isFinite(elevation)) throw new Error("ADSB_ALT must be a number of feet.");
  return elevation;
}
