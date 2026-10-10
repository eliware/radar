export async function startWebApplication(dependencies) {
  dependencies.loadEnvironment({ quiet: true });
  const port = validPort(process.env.PORT ?? "3000", "PORT");
  const feedPort = validPort(process.env.ADSB_PORT ?? "30003", "ADSB_PORT");
  const location = dependencies.parseAdsbLocation(process.env.MY_LOCATION);
  const elevationFeet = validElevation(process.env.MY_ELEVATION ?? "300");
  const log = dependencies.createLogger({ level: process.env.LOG_LEVEL ?? "info" });
  dependencies.registerHandlers({ log });
  const feed = dependencies.createAircraftFeed({
    host: process.env.ADSB_HOST ?? "127.0.0.1",
    port: feedPort,
    locationText: process.env.MY_LOCATION,
    onError: (error) => log.warn(`ADS-B feed error: ${error.message}`),
  });
  const app = await dependencies.createRadarServer({ feed, location, elevationFeet });
  let shutdownPromise;
  const shutdown = () => {
    if (shutdownPromise) return shutdownPromise;
    feed.close();
    shutdownPromise = app.close().then(() => log.info("Web application stopped"));
    return shutdownPromise;
  };
  dependencies.registerSignals({ log, shutdownHook: shutdown });
  await app.listen({ host: "0.0.0.0", port });
  log.info(`Web application listening on port ${port}`);
  return { app, feed, shutdown };
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
  if (!Number.isFinite(elevation)) throw new Error("MY_ELEVATION must be a number of feet.");
  return elevation;
}
