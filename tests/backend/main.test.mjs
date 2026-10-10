import { afterEach, expect, jest, test } from "@jest/globals";
import { startWebApplication } from "../../src/backend/main.mjs";

afterEach(() => {
  for (const key of [
    "PORT",
    "ADSB_PORT",
    "ADSB_HOST",
    "MY_LOCATION",
    "MY_ELEVATION",
    "LOG_LEVEL",
  ]) {
    delete process.env[key];
  }
});

function dependencies() {
  const log = { info: jest.fn(), warn: jest.fn() };
  const feed = { close: jest.fn() };
  const app = { listen: jest.fn(async () => undefined), close: jest.fn(async () => undefined) };
  const signals = {};
  return {
    log,
    feed,
    app,
    signals,
    values: {
      loadEnvironment: jest.fn(),
      createLogger: jest.fn(() => log),
      registerHandlers: jest.fn(),
      registerSignals: jest.fn((value) => Object.assign(signals, value)),
      createAircraftFeed: jest.fn(() => feed),
      createRadarServer: jest.fn(async () => app),
      parseAdsbLocation: (value) => (value ? { latitude: 43, longitude: -70 } : null),
    },
  };
}

test("starts Fastify and closes the feed after a signal", async () => {
  process.env.PORT = "8080";
  process.env.ADSB_PORT = "30004";
  process.env.ADSB_HOST = "receiver";
  process.env.MY_LOCATION = "43, -70";
  process.env.MY_ELEVATION = "320";
  const deps = dependencies();
  const runtime = await startWebApplication(deps.values);
  expect(deps.values.createAircraftFeed).toHaveBeenCalledWith(
    expect.objectContaining({ host: "receiver", port: 30004, locationText: "43, -70" }),
  );
  expect(deps.values.createRadarServer).toHaveBeenCalledWith({
    feed: deps.feed,
    location: { latitude: 43, longitude: -70 },
    elevationFeet: 320,
  });
  expect(deps.app.listen).toHaveBeenCalledWith({ host: "127.0.0.1", port: 8080 });
  deps.values.createAircraftFeed.mock.calls[0][0].onError(new Error("offline"));
  expect(deps.log.warn).toHaveBeenCalledWith("ADS-B feed error: offline");
  await deps.signals.shutdownHook();
  await deps.signals.shutdownHook();
  expect(deps.feed.close).toHaveBeenCalledTimes(1);
  expect(deps.app.close).toHaveBeenCalledTimes(1);
  expect(runtime.app).toBe(deps.app);
});

test("uses default web and feed settings", async () => {
  const deps = dependencies();
  await startWebApplication(deps.values);
  expect(deps.values.createAircraftFeed).toHaveBeenCalledWith(
    expect.objectContaining({ host: "127.0.0.1", port: 30003 }),
  );
  expect(deps.app.listen).toHaveBeenCalledWith({ host: "127.0.0.1", port: 3000 });
  expect(deps.values.createLogger).toHaveBeenCalledWith({ level: "info" });
});

test.each([
  ["PORT", "bad"],
  ["ADSB_PORT", "65536"],
  ["MY_ELEVATION", "bad"],
])("rejects invalid %s before it starts the feed", async (key, value) => {
  process.env[key] = value;
  const deps = dependencies();
  const message =
    key === "MY_ELEVATION"
      ? "MY_ELEVATION must be a number of feet."
      : `${key} must be an integer from 1 through 65535`;
  await expect(startWebApplication(deps.values)).rejects.toThrow(message);
  expect(deps.values.createAircraftFeed).not.toHaveBeenCalled();
});
