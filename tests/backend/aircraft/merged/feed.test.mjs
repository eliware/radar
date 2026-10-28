import { expect, jest, test } from "@jest/globals";
import { createMergedAircraftFeed } from "../../../../src/backend/aircraft/merged/feed.mjs";
import { registerApiRoutes } from "../../../../src/backend/api-routes.mjs";

function setup() {
  let localItems = [{ icao: "ABC123", distanceNauticalMiles: 4, altitudeFeet: 12000 }];
  let remoteItems = [
    { icao: "ABC123", distanceNauticalMiles: 4, latitude: 43 },
    { icao: "DEF456", distanceNauticalMiles: 15, remoteOnly: true },
  ];
  let onLocal;
  let onRemote;
  let tick;
  const clearIntervalFn = jest.fn();
  const localFeed = {
    list: () => localItems,
    isReady: () => true,
    subscribe: jest.fn((listener) => ((onLocal = listener), jest.fn())),
    setRouteLookupsEnabled: jest.fn(),
  };
  const remoteSource = {
    list: () => remoteItems,
    subscribe: jest.fn((listener) => ((onRemote = listener), jest.fn())),
    connectClient: jest.fn(),
    setClientRadius: jest.fn(),
    setClientLocalOnly: jest.fn(),
    disconnectClient: jest.fn(),
    setRouteLookupsEnabled: jest.fn(),
    close: jest.fn(),
  };
  const feed = createMergedAircraftFeed(localFeed, remoteSource, {
    defaultRangeNm: 10,
    setIntervalFn: jest.fn((callback, ms) => ((tick = callback), expect(ms).toBe(1000), 1)),
    clearIntervalFn,
  });
  return {
    feed,
    localFeed,
    remoteSource,
    clearIntervalFn,
    tick: () => tick(),
    local: (items) => (localItems = items),
    remote: (items) => (remoteItems = items),
    onLocal: (item) => onLocal(item),
    onRemote: () => onRemote(remoteItems),
  };
}

test("deduplicates ICAO records and gives local fields precedence", () => {
  const { feed } = setup();
  expect(feed.list()).toEqual([
    expect.objectContaining({
      icao: "ABC123",
      altitudeFeet: 12000,
      latitude: 43,
      remoteOnly: false,
    }),
    expect.objectContaining({ icao: "DEF456", remoteOnly: true }),
  ]);
  expect(feed.isReady()).toBe(true);
});

test("sends one filtered snapshot per second without event-driven broadcasts", () => {
  const state = setup();
  const near = jest.fn();
  const far = jest.fn();
  const stopNear = state.feed.subscribe(near, "near");
  state.feed.subscribe(far, "far");
  state.feed.setClientRadius("near", 5);
  state.feed.setClientRadius("far", 20);
  state.local([{ icao: "ABC123", distanceNauticalMiles: 4, altitudeFeet: 13000 }]);
  state.onLocal({ icao: "ABC123", distanceNauticalMiles: 4, altitudeFeet: 13000 });
  state.onRemote();
  expect(near).not.toHaveBeenCalled();
  state.tick();
  expect(near).toHaveBeenCalledWith(
    expect.objectContaining({
      event: "aircraft-snapshot",
      localFurthestDistanceNm: 4,
      aircraft: [expect.objectContaining({ icao: "ABC123", altitudeFeet: 13000 })],
    }),
  );
  expect(far.mock.calls[0][0].aircraft).toHaveLength(2);
  expect(state.remoteSource.connectClient).toHaveBeenCalledWith("near");
  expect(state.remoteSource.setClientRadius).toHaveBeenCalledWith("near", 5);
  stopNear();
  stopNear();
  expect(state.remoteSource.disconnectClient).toHaveBeenCalledTimes(1);
});

test("filters remote-only aircraft per client and forwards local-only policy", () => {
  const state = setup();
  const localOnly = jest.fn();
  const remoteEnabled = jest.fn();
  state.feed.subscribe(localOnly, "local");
  state.feed.subscribe(remoteEnabled, "remote");
  state.feed.setClientLocalOnly("missing", true);
  state.feed.setClientLocalOnly("local", "true");
  state.feed.setClientRadius("remote", 20);
  state.feed.setClientLocalOnly("local", true);
  expect(state.remoteSource.setClientLocalOnly).toHaveBeenCalledWith("local", true);
  expect(localOnly).toHaveBeenLastCalledWith(
    expect.objectContaining({
      event: "aircraft-snapshot",
      aircraft: [expect.objectContaining({ icao: "ABC123", remoteOnly: false })],
    }),
  );
  state.tick();
  expect(localOnly.mock.calls.at(-1)[0].aircraft).toHaveLength(1);
  expect(remoteEnabled.mock.calls.at(-1)[0].aircraft).toHaveLength(2);
});

test("stops snapshot timer with last client and stops safely on close", () => {
  const state = setup();
  expect(state.clearIntervalFn).not.toHaveBeenCalled();
  const unsubscribe = state.feed.subscribe(jest.fn());
  unsubscribe();
  expect(state.clearIntervalFn).toHaveBeenCalledTimes(1);
  state.feed.subscribe(jest.fn());
  state.feed.close();
  state.feed.close();
  expect(state.clearIntervalFn).toHaveBeenCalledTimes(2);
  expect(state.remoteSource.close).toHaveBeenCalledTimes(1);
});

test("closes without clients and rejects subscribers after close", () => {
  const state = setup();
  state.feed.close();
  expect(state.feed.subscribe(jest.fn())()).toBe(false);
  expect(state.clearIntervalFn).not.toHaveBeenCalled();
});

test("uses built-in timers when no options object is provided", () => {
  const localFeed = { list: () => [], isReady: () => true, subscribe: () => () => {} };
  const remoteSource = {
    list: () => [],
    subscribe: () => () => {},
    connectClient: jest.fn(),
    setClientRadius: jest.fn(),
    disconnectClient: jest.fn(),
    close: jest.fn(),
  };
  const feed = createMergedAircraftFeed(localFeed, remoteSource);
  const stop = feed.subscribe(jest.fn());
  stop();
  feed.close();
});

test("forwards API route lookup controls, clamps radii, and ignores unknown clients", async () => {
  const state = setup();
  const routes = new Map();
  const app = {
    get: (path, ...args) => routes.set(path, args),
    post: (path, ...args) => routes.set(path, args),
  };
  registerApiRoutes(app, state.feed);
  const handler = routes.get("/api/route-lookups")[0];
  expect(await handler({ body: { enabled: false } }, {})).toEqual({ enabled: false });
  const invalidReply = {
    code: jest.fn(function (status) {
      this.status = status;
      return this;
    }),
    send: jest.fn(),
  };
  await handler({ body: { enabled: "false" } }, invalidReply);
  expect(invalidReply.code).toHaveBeenCalledWith(400);
  expect(invalidReply.send).toHaveBeenCalledWith({ error: "enabled must be a boolean." });
  const unavailableRoutes = new Map();
  registerApiRoutes(
    {
      get: (path, ...args) => unavailableRoutes.set(path, args),
      post: (path, ...args) => unavailableRoutes.set(path, args),
    },
    { list: () => [] },
  );
  await unavailableRoutes.get("/api/route-lookups")[0]({ body: { enabled: true } }, invalidReply);
  expect(invalidReply.code).toHaveBeenLastCalledWith(501);
  state.feed.setClientRadius("missing", 40);
  const unsubscribe = state.feed.subscribe(jest.fn(), "client");
  state.feed.setClientRadius("client", 400);
  state.feed.setClientRadius("client", 0);
  expect(state.remoteSource.setClientRadius.mock.calls).toEqual([
    ["client", 300],
    ["client", 1],
  ]);
  expect(state.localFeed.setRouteLookupsEnabled).toHaveBeenCalledWith(false);
  expect(state.remoteSource.setRouteLookupsEnabled).toHaveBeenCalledWith(false);
  state.remote([]);
  state.onRemote();
  unsubscribe();
});

test("filters missing and out-of-range aircraft and supports default options", () => {
  let tick;
  const subscriber = jest.fn();
  const localFeed = { list: () => [], isReady: () => true, subscribe: () => () => {} };
  const remoteSource = {
    list: () => [
      { icao: "UNKNOWN", remoteOnly: true },
      { icao: "FAR999", distanceNauticalMiles: 50, remoteOnly: true },
    ],
    subscribe: () => () => {},
    connectClient: jest.fn(),
    setClientRadius: jest.fn(),
    disconnectClient: jest.fn(),
    close: jest.fn(),
  };
  const feed = createMergedAircraftFeed(localFeed, remoteSource, {
    setIntervalFn: (callback) => ((tick = callback), 1),
    clearIntervalFn: jest.fn(),
  });
  const unsubscribe = feed.subscribe(subscriber);
  expect(remoteSource.connectClient).toHaveBeenCalled();
  feed.setClientRadius(remoteSource.connectClient.mock.calls[0][0], 2);
  tick();
  expect(subscriber).toHaveBeenCalledWith(
    expect.objectContaining({ event: "aircraft-snapshot", aircraft: [] }),
  );
  unsubscribe();
  feed.close();
});
