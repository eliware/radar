import { expect, jest, test } from "@jest/globals";
import { createAircraftEnrichmentFeed } from "../../src/backend/aircraft-enrichment-feed.mjs";

function setup(items = []) {
  let onUpdate;
  const unsubscribe = jest.fn();
  const feed = {
    list: jest.fn(() => items),
    subscribe: jest.fn((callback) => {
      onUpdate = callback;
      return unsubscribe;
    }),
  };
  const lookup = {
    getAircraftType: jest.fn(() => Promise.resolve(null)),
    getCallsignRoute: jest.fn(() => Promise.resolve(null)),
  };
  return {
    feed,
    lookup,
    onUpdate: (item) => onUpdate(item),
    unsubscribe,
    enriched: createAircraftEnrichmentFeed(feed, lookup),
  };
}

test("relays aircraft and adds cached type and route data to list and updates", async () => {
  const item = { icao: "ABC123", callsign: "BAW183", altitudeFeet: 30000 };
  const state = setup([item]);
  state.lookup.getAircraftType.mockResolvedValue({ aircraftTypeCode: "B738" });
  state.lookup.getCallsignRoute.mockResolvedValue({ origin: "EGLL", destination: "KBOS" });
  const updates = [];
  state.enriched.subscribe((aircraft) => updates.push(aircraft));
  state.onUpdate(item);
  await Promise.resolve();
  await Promise.resolve();
  expect(state.enriched.list()).toEqual([
    {
      ...item,
      aircraftTypeCode: "B738",
      origin: "EGLL",
      destination: "KBOS",
    },
  ]);
  expect(updates).toEqual([
    item,
    { ...item, aircraftTypeCode: "B738" },
    { ...item, aircraftTypeCode: "B738", origin: "EGLL", destination: "KBOS" },
  ]);
  expect(state.lookup.getAircraftType).toHaveBeenCalledWith("ABC123");
  expect(state.lookup.getCallsignRoute).toHaveBeenCalledWith("BAW183");
});

test("skips unusable callsigns and leaves missing lookup data optional", async () => {
  const state = setup();
  const update = jest.fn();
  state.enriched.subscribe(update);
  state.onUpdate({ icao: "DEF456", callsign: "AD" });
  state.onUpdate({ callsign: "BAW183" });
  await Promise.resolve();
  expect(state.lookup.getCallsignRoute).not.toHaveBeenCalled();
  expect(state.lookup.getAircraftType).toHaveBeenCalledWith("DEF456");
  expect(update).toHaveBeenCalledTimes(1);
  expect(state.enriched.list()).toEqual([]);
});

test("keeps route results tied to the current callsign and handles lookup failures", async () => {
  const state = setup();
  const updates = [];
  state.enriched.subscribe((aircraft) => updates.push(aircraft));
  const finishRoutes = [];
  state.lookup.getCallsignRoute.mockImplementation(
    () =>
      new Promise((resolve) => {
        finishRoutes.push(resolve);
      }),
  );
  state.lookup.getAircraftType.mockRejectedValue(new Error("offline"));
  state.onUpdate({ icao: "ABC123", callsign: "BAW183" });
  state.onUpdate({ icao: "ABC123", callsign: "AFR012" });
  finishRoutes[0]({ origin: "EGLL", destination: "KBOS" });
  await Promise.resolve();
  expect(updates.at(-1)).toEqual({ icao: "ABC123", callsign: "AFR012" });
  expect(updates.at(-1)).not.toHaveProperty("origin");
  finishRoutes[1]({ origin: "LFPG", destination: "KJFK" });
  await Promise.resolve();
  expect(updates.at(-1)).toMatchObject({ origin: "LFPG", destination: "KJFK" });
  expect(state.lookup.getCallsignRoute).toHaveBeenCalledTimes(2);
});

test("unsubscribes from the source and clears listeners on close", () => {
  const state = setup();
  const unsubscribe = state.enriched.subscribe(jest.fn());
  expect(unsubscribe()).toBe(true);
  expect(unsubscribe()).toBe(false);
  state.enriched.close();
  expect(state.unsubscribe).toHaveBeenCalledTimes(1);
});

test("keeps a destination when ADSBdb has no origin", async () => {
  const state = setup();
  const update = jest.fn();
  state.lookup.getCallsignRoute.mockResolvedValue({ destination: "KBOS" });
  state.enriched.subscribe(update);
  state.onUpdate({ icao: "ABC123", callsign: "BAW183" });
  await Promise.resolve();
  expect(update).toHaveBeenLastCalledWith({
    icao: "ABC123",
    callsign: "BAW183",
    destination: "KBOS",
  });
});

test("does not add route fields when ADSBdb has no match", async () => {
  const state = setup();
  state.lookup.getCallsignRoute.mockResolvedValue(null);
  const update = jest.fn();
  state.enriched.subscribe(update);
  state.onUpdate({ icao: "ABC123", callsign: "BAW183" });
  await Promise.resolve();
  expect(update).toHaveBeenCalledTimes(1);
});

test("ignores a failed route lookup", async () => {
  const state = setup();
  state.lookup.getCallsignRoute.mockRejectedValue(new Error("offline"));
  const update = jest.fn();
  state.enriched.subscribe(update);
  state.onUpdate({ icao: "ABC123", callsign: "BAW183" });
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(update).toHaveBeenCalledTimes(1);
});

test("keeps a bounded set of recent aircraft metadata", async () => {
  const state = setup();
  state.lookup.getAircraftType.mockImplementation(async (icao) => ({ aircraftTypeCode: icao }));
  for (let index = 0; index < 257; index += 1) {
    state.onUpdate({ icao: `A${index}` });
  }
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(state.lookup.getAircraftType).toHaveBeenCalledTimes(257);
});
