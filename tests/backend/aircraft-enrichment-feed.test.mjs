import { expect, jest, test } from "@jest/globals";
import { createAircraftEnrichmentFeed } from "../../src/backend/aircraft-enrichment-feed.mjs";

function setup(items = []) {
  let onUpdate;
  const unsubscribe = jest.fn();
  const feed = {
    list: jest.fn(() => items),
    subscribe: jest.fn((callback) => ((onUpdate = callback), unsubscribe)),
  };
  const lookup = {
    getAircraftType: jest.fn(async () => null),
    getCallsignRoute: jest.fn(async () => null),
  };
  return {
    feed,
    enriched: createAircraftEnrichmentFeed(feed, lookup),
    onUpdate: (item) => onUpdate(item),
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
  expect(state.feed.list).toHaveBeenCalledTimes(1);
});

test("unsubscribes from the source and clears feed listeners", () => {
  const state = setup();
  const subscriber = jest.fn();
  const unsubscribe = state.enriched.subscribe(subscriber);
  expect(unsubscribe()).toBe(true);
  expect(unsubscribe()).toBe(false);
  state.enriched.close();
  state.onUpdate({ icao: "ABC123" });
  expect(state.unsubscribe).toHaveBeenCalledTimes(1);
  expect(subscriber).not.toHaveBeenCalled();
});
