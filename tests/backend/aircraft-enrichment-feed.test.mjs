import { expect, jest, test } from "@jest/globals";
import { createAircraftEnrichmentFeed } from "../../src/backend/aircraft-enrichment-feed.mjs";

function setup(items = []) {
  let currentItems = items;
  let onUpdate;
  const unsubscribe = jest.fn();
  const feed = {
    list: jest.fn(() => currentItems),
    isReady: jest.fn(() => true),
    subscribe: jest.fn((callback) => ((onUpdate = callback), unsubscribe)),
  };
  const lookup = {
    getAircraftType: jest.fn(async () => null),
    getCallsignRoute: jest.fn(async () => null),
  };
  return {
    feed,
    enriched: createAircraftEnrichmentFeed(feed, lookup),
    lookup,
    onUpdate: (item) => onUpdate(item),
    setItems: (next) => (currentItems = next),
    unsubscribe,
  };
}

test("relays feed updates and enriches the current snapshot", () => {
  const item = { icao: "ABC123", callsign: "BAW183" };
  const state = setup([item]);
  const subscriber = jest.fn();
  state.enriched.subscribe(subscriber);
  state.onUpdate(item);
  expect(subscriber).toHaveBeenCalledWith(item);
  expect(state.enriched.list()).toEqual([item]);
  expect(state.enriched.isReady()).toBe(true);
  expect(state.feed.list).toHaveBeenCalledTimes(2);
});

test("unsubscribes from the source and clears feed listeners", () => {
  const state = setup();
  const subscriber = jest.fn();
  const unsubscribe = state.enriched.subscribe(subscriber);
  expect(unsubscribe()).toBe(true);
  expect(unsubscribe()).toBe(false);
  state.enriched.close();
  state.enriched.close();
  state.onUpdate({ icao: "ABC123" });
  expect(state.unsubscribe).toHaveBeenCalledTimes(1);
  expect(subscriber).not.toHaveBeenCalled();
});

test("does not publish a type lookup after the source removes an aircraft", async () => {
  let resolveType;
  const item = { icao: "ABC123" };
  const state = setup([item]);
  state.lookup.getAircraftType.mockImplementation(
    () => new Promise((resolve) => (resolveType = resolve)),
  );
  const subscriber = jest.fn();
  state.enriched.subscribe(subscriber);
  state.onUpdate(item);
  state.setItems([]);
  resolveType({ aircraftTypeCode: "B738" });
  await Promise.resolve();
  expect(subscriber).toHaveBeenCalledTimes(1);
  expect(state.enriched.list()).toEqual([]);
});

test("exposes the route lookup pause control", () => {
  const item = { icao: "ABC123", callsign: "BAW183" };
  const state = setup([item]);
  state.enriched.setRouteLookupsEnabled(false);
  state.onUpdate(item);
  expect(state.lookup.getAircraftType).toHaveBeenCalledWith("ABC123");
  expect(state.lookup.getCallsignRoute).not.toHaveBeenCalled();
});
