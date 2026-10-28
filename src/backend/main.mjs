import { parseRadarViewSettings } from "../shared/radar-view-settings.mjs";
import { parseElevation } from "./config/elevation.mjs";
import { parsePort } from "./config/port.mjs";
import { registerApplicationShutdown } from "./lifecycle/shutdown.mjs";

export async function startWebApplication(dependencies) {
  dependencies.loadEnvironment({ quiet: true });
  const port = parsePort(process.env.PORT ?? "3000", "PORT");
  const feedPort = parsePort(process.env.ADSB_PORT ?? "30003", "ADSB_PORT");
  const location = dependencies.parseAdsbLocation(process.env.ADSB_LAT, process.env.ADSB_LON);
  const elevationFeet = parseElevation(process.env.ADSB_ALT ?? "300");
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
  const mergedFeed = dependencies.createMergedAircraftFeed(enrichedFeed, remoteSource, {
    defaultRangeNm: radarViewSettings.defaultRangeNm,
  });
  const app = await dependencies.createRadarServer({
    feed: mergedFeed,
    location,
    elevationFeet,
    ...radarViewSettings,
    airportDatabase,
    metarLookup,
  });
  const shutdown = registerApplicationShutdown({
    app,
    resources: [mergedFeed, enrichedFeed, feed],
    log,
    registerSignals: dependencies.registerSignals,
  });
  await app.listen({ host: "0.0.0.0", port });
  log.info(`Web application listening at TCP endpoint ${port}`);
  return { app, feed: mergedFeed, shutdown };
}
