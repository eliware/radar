import { resolveWebNetworkConfiguration } from "./config/web.mjs";
import { resolveWebServiceConfiguration } from "./config/services.mjs";
import { registerApplicationShutdown } from "./lifecycle/shutdown.mjs";

export async function startWebApplication(dependencies) {
  dependencies.loadEnvironment({ quiet: true });
  const configuration = {
    ...resolveWebNetworkConfiguration(process.env, dependencies.parseAdsbLocation),
    ...resolveWebServiceConfiguration(process.env, dependencies.parseMetarStations),
  };
  const { port, feedPort, location, elevationFeet, radarViewSettings } = configuration;
  const airportDatabase = dependencies.createAirportDatabase(configuration.airportDatabasePath);
  const metarLookup = dependencies.createMetarLookup(configuration.metarStations);
  const log = dependencies.createLogger({ level: configuration.logLevel });
  dependencies.registerHandlers({ log });
  const feed = dependencies.createAircraftFeed({
    host: configuration.feedHost,
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
