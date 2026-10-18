import { expect, jest, test } from "@jest/globals";
import { createMergedAircraftFeed } from "../../../src/backend/aircraft/merged-feed.mjs";

function setup() {
  let onLocal;
  let onRemote;
  let localItems = [{ icao: "ABC123", altitudeFeet: 12_000, lastSeen: 10 }];
  const localFeed = {
    list: () => localItems,
    isReady: () => true,
    subscribe: jest.fn((listener) => ((onLocal = listener), jest.fn())),
    setRouteLookupsEnabled: jest.fn(),
  };
  let remoteItems = [
    { icao: "ABC123", latitude: 43.1, altitudeFeet: 10_000, remoteOnly: true },
    { icao: "DEF456", latitude: 43.2, remoteOnly: true },
  ];
  const remoteSource = {
    list: () => remoteItems,
    subscribe: jest.fn((listener) => ((onRemote = listener), jest.fn())),
    connectClient: jest.fn(),
    setClientRadius: jest.fn(),
    disconnectClient: jest.fn(),
    setRouteLookupsEnabled: jest.fn(),
    close: jest.fn(),
  };
  return {
    feed: createMergedAircraftFeed(localFeed, remoteSource),
    localFeed,
    remoteSource,
    onLocal: (item) => onLocal(item),
    onRemote: () => onRemote(remoteItems),
    setLocal: (items) => (localItems = items),
    setRemote: (items) => (remoteItems = items),
  };
}

test("deduplicates on ICAO and gives local fields precedence", () => {
  const state = setup();
  expect(state.feed.list()).toEqual([
    expect.objectContaining({
      icao: "ABC123",
      altitudeFeet: 12_000,
      latitude: 43.1,
      lastSeen: 10,
      remoteOnly: false,
    }),
    expect.objectContaining({ icao: "DEF456", remoteOnly: true }),
  ]);
  expect(state.feed.isReady()).toBe(true);
});

test("tracks connected clients and publishes local and remote changes", () => {
  const state = setup();
  const subscriber = jest.fn();
  const unsubscribe = state.feed.subscribe(subscriber, "socket-a");
  state.feed.setClientRadius("socket-a", 45);
  state.localFeed.list = () => [{ icao: "ABC123", altitudeFeet: 13_000 }];
  state.onLocal({ icao: "ABC123" });
  expect(subscriber).toHaveBeenLastCalledWith(
    expect.objectContaining({ altitudeFeet: 13_000, remoteOnly: false }),
  );
  state.onRemote();
  expect(subscriber).toHaveBeenLastCalledWith(
    expect.objectContaining({ event: "remote-snapshot", aircraft: expect.any(Array) }),
  );
  expect(state.remoteSource.connectClient).toHaveBeenCalledWith("socket-a");
  expect(state.remoteSource.setClientRadius).toHaveBeenCalledWith("socket-a", 45);
  unsubscribe();
  unsubscribe();
  expect(state.remoteSource.disconnectClient).toHaveBeenCalledTimes(1);
});

test("forwards route lookup controls and closes source listeners", () => {
  const state = setup();
  state.feed.setRouteLookupsEnabled(false);
  expect(state.localFeed.setRouteLookupsEnabled).toHaveBeenCalledWith(false);
  expect(state.remoteSource.setRouteLookupsEnabled).toHaveBeenCalledWith(false);
  state.feed.close();
  state.feed.close();
  expect(state.remoteSource.close).toHaveBeenCalledTimes(1);
});

test("supports default client keys and publishes nothing for unknown ICAO values", () => {
  const state = setup();
  const subscriber = jest.fn();
  const unsubscribe = state.feed.subscribe(subscriber);
  expect(state.remoteSource.connectClient.mock.calls[0][0]).toEqual(expect.any(Symbol));
  state.setLocal([{ icao: 123 }]);
  state.setRemote([]);
  state.onLocal({ icao: "MISSING" });
  expect(subscriber).not.toHaveBeenCalled();
  expect(state.feed.list()).toEqual([{ icao: 123 }]);
  unsubscribe();
});
