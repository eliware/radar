import { afterEach, expect, jest, test } from "@jest/globals";
import { startWebApplication } from "../../src/backend/main.mjs";

afterEach(() => {
  for (const key of [
    "PORT",
    "ADSB_PORT",
    "ADSB_HOST",
    "ADSB_LAT",
    "ADSB_LON",
    "ADSB_ALT",
    "RADAR_DEFAULT_RANGE_NM",
    "RADAR_DEFAULT_ROTATION",
    "NASR_DATABASE_PATH",
    "METAR_STATIONS",
    "LOG_LEVEL",
    "ADSBLOL_POLL_INTERVAL_MS",
  ]) {
    delete process.env[key];
  }
});

function dependencies() {
  const log = { debug: jest.fn(), info: jest.fn(), warn: jest.fn() };
  const feed = { close: jest.fn() };
  const enrichedFeed = { close: jest.fn() };
  const remoteSource = { close: jest.fn() };
  const mergedFeed = { close: jest.fn() };
  const lookup = {};
  const app = { listen: jest.fn(async () => undefined), close: jest.fn(async () => undefined) };
  const signals = {};
  return {
    log,
    feed,
    enrichedFeed,
    remoteSource,
    mergedFeed,
    lookup,
    app,
    signals,
    values: {
      loadEnvironment: jest.fn(),
      createLogger: jest.fn(() => log),
      registerHandlers: jest.fn(),
      registerSignals: jest.fn((value) => Object.assign(signals, value)),
      createAircraftFeed: jest.fn(() => feed),
      createAdsbLolLookup: jest.fn(() => lookup),
      createAircraftEnrichmentFeed: jest.fn(() => enrichedFeed),
      createAdsbLolRemoteSource: jest.fn(() => remoteSource),
      createMergedAircraftFeed: jest.fn(() => mergedFeed),
      parseMetarStations: jest.fn(() => ["KLEW", "KPWM", "KBXM"]),
      createMetarLookup: jest.fn((stations) => ({ stations, get: jest.fn() })),
      createAirportDatabase: jest.fn(() => null),
      createRadarServer: jest.fn(async () => app),
      parseAdsbLocation: (latitude) => (latitude ? { latitude: 43, longitude: -70 } : null),
    },
  };
}

test("starts Fastify and closes the feed after a signal", async () => {
  process.env.PORT = "8080";
  process.env.ADSB_PORT = "30004";
  process.env.ADSB_HOST = "receiver";
  process.env.ADSB_LAT = "43";
  process.env.ADSB_LON = "-70";
  process.env.ADSB_ALT = "320";
  process.env.RADAR_DEFAULT_RANGE_NM = "25";
  process.env.RADAR_DEFAULT_ROTATION = "140";
  const deps = dependencies();
  const runtime = await startWebApplication(deps.values);
  expect(deps.values.createAircraftFeed).toHaveBeenCalledWith(
    expect.objectContaining({
      host: "receiver",
      port: 30004,
      locationLatitude: "43",
      locationLongitude: "-70",
    }),
  );
  expect(deps.values.createRadarServer).toHaveBeenCalledWith({
    feed: deps.mergedFeed,
    location: { latitude: 43, longitude: -70 },
    elevationFeet: 320,
    defaultRangeNm: 25,
    defaultRotationDegrees: 140,
    airportDatabase: null,
    metarLookup: deps.values.createMetarLookup.mock.results[0].value,
  });
  expect(deps.app.listen).toHaveBeenCalledWith({ host: "0.0.0.0", port: 8080 });
  deps.values.createAircraftFeed.mock.calls[0][0].onError(new Error("offline"));
  deps.values.createAdsbLolRemoteSource.mock.calls[0][0].onError(new Error("remote offline"));
  deps.values.createAdsbLolRemoteSource.mock.calls[0][0].onRequest({
    radiusNm: 42,
    apiKeyHeaderPresent: true,
  });
  deps.values.createAdsbLolRemoteSource.mock.calls[0][0].onRequest({
    radiusNm: 42,
    apiKeyHeaderPresent: false,
  });
  expect(deps.log.warn).toHaveBeenCalledWith("ADS-B stream error: offline");
  expect(deps.log.warn).toHaveBeenCalledWith("ADSB.lol remote feed error: remote offline");
  expect(deps.log.debug).toHaveBeenCalledWith(
    "ADSB.lol re-api query: radius=42 NM; x-api-key header present.",
  );
  expect(deps.log.debug).toHaveBeenCalledWith(
    "ADSB.lol re-api query: radius=42 NM; x-api-key header missing.",
  );
  expect(runtime.app).toBe(deps.app);
  expect(runtime.feed).toBe(deps.mergedFeed);
  expect(runtime.shutdown).toBe(deps.signals.shutdownHook);
});

test("uses default web and feed settings", async () => {
  const deps = dependencies();
  await startWebApplication(deps.values);
  expect(deps.values.createAircraftFeed).toHaveBeenCalledWith(
    expect.objectContaining({ host: "127.0.0.1", port: 30003 }),
  );
  expect(deps.values.createAirportDatabase).toHaveBeenCalledWith(undefined);
  expect(deps.values.createRadarServer).toHaveBeenCalledWith(
    expect.objectContaining({ defaultRangeNm: 20, defaultRotationDegrees: 0 }),
  );
  expect(deps.app.listen).toHaveBeenCalledWith({ host: "0.0.0.0", port: 3000 });
  expect(deps.values.createLogger).toHaveBeenCalledWith({ level: "info" });
  expect(deps.values.createAdsbLolRemoteSource).toHaveBeenCalledWith(
    expect.objectContaining({ pollIntervalMs: 15000, onRequest: expect.any(Function) }),
  );
});

test("passes the configured ADSB.lol polling interval to the remote source", async () => {
  process.env.ADSBLOL_POLL_INTERVAL_MS = "45000";
  const deps = dependencies();
  await startWebApplication(deps.values);
  expect(deps.values.createAdsbLolRemoteSource).toHaveBeenCalledWith(
    expect.objectContaining({ pollIntervalMs: 45000 }),
  );
});
