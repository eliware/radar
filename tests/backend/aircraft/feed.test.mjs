import { afterEach, expect, jest, test } from "@jest/globals";
import {
  aircraftFeedDependencies,
  createAircraftFeed,
} from "../../../src/backend/aircraft/feed.mjs";

afterEach(() => {
  delete process.env.ADSB_HOST;
  delete process.env.ADSB_PORT;
  delete process.env.ADSB_LAT;
  delete process.env.ADSB_LON;
  jest.restoreAllMocks();
});

function setup(overrides = {}) {
  let feedOptions;
  const aircraft = { icao: "ABC123", lastSeen: 10 };
  const aircraftList = { update: jest.fn(() => aircraft), list: jest.fn(() => [aircraft]) };
  const dependencies = {
    parseAdsbLocation: jest.fn(() => ({ latitude: 43, longitude: -70 })),
    createAircraftList: jest.fn(() => aircraftList),
    parseSbsMessage: jest.fn((line) => (line === "ok" ? { icao: "ABC123" } : null)),
    calculateAircraftRange: jest.fn(() => null),
    connectSbsFeed: jest.fn((options) => {
      feedOptions = options;
      return { close: jest.fn(), isConnected: jest.fn(() => true) };
    }),
    ...overrides,
  };
  const feed = createAircraftFeed({
    host: "localhost",
    port: 30003,
    locationLatitude: "43",
    locationLongitude: "-70",
    dependencies,
  });
  return { feed, feedOptions, dependencies, aircraft, aircraftList };
}

test("publishes parsed aircraft updates and returns current aircraft", () => {
  const state = setup();
  const subscriber = jest.fn();
  const unsubscribe = state.feed.subscribe(subscriber);
  state.feedOptions.onLine("bad");
  state.feedOptions.onLine("ok");
  expect(state.dependencies.connectSbsFeed).toHaveBeenCalledWith(
    expect.objectContaining({ host: "localhost", port: 30003 }),
  );
  expect(subscriber).toHaveBeenCalledWith(state.aircraft);
  expect(state.feed.list()).toEqual([state.aircraft]);
  expect(state.feed.isReady()).toBe(true);
  expect(unsubscribe()).toBe(true);
  expect(unsubscribe()).toBe(false);
  state.feed.close();
});

test("reads the configured origin before it opens the feed", () => {
  const state = setup();
  expect(state.dependencies.parseAdsbLocation).toHaveBeenCalledWith("43", "-70");
  expect(state.dependencies.createAircraftList).toHaveBeenCalledTimes(1);
});

test("uses explicit feed settings and accepts errors without a callback", () => {
  let options;
  const connection = { close: jest.fn() };
  jest.spyOn(aircraftFeedDependencies, "connectSbsFeed").mockImplementation((value) => {
    options = value;
    return connection;
  });
  const feed = createAircraftFeed({ host: "127.0.0.1", port: 30003 });
  options.onError(new Error("offline"));
  options.onLine("MSG,3,1,1,abc123,2,,,,,,,,,,,,,,,");
  expect(options).toEqual(expect.objectContaining({ host: "127.0.0.1", port: 30003 }));
  expect(feed.list()).toHaveLength(1);
  feed.close();
  expect(connection.close).toHaveBeenCalledTimes(1);
});
