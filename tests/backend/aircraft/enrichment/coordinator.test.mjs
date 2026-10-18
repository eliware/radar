import { expect, jest, test } from "@jest/globals";
import { createAircraftEnrichmentCoordinator } from "../../../../src/backend/aircraft/enrichment/coordinator.mjs";

function setup() {
  return {
    changes: [],
    lookup: {
      getAircraftType: jest.fn(async () => null),
      getCallsignRoute: jest.fn(async () => null),
    },
    coordinator: null,
  };
}

function createState() {
  const state = setup();
  state.coordinator = createAircraftEnrichmentCoordinator(state.lookup);
  state.publish = (item) => state.changes.push(item);
  return state;
}

test("publishes aircraft first and adds lookup results to later updates", async () => {
  const state = createState();
  state.lookup.getAircraftType.mockResolvedValue({ aircraftTypeCode: "B738" });
  state.lookup.getCallsignRoute.mockResolvedValue({ origin: "EGLL", destination: "KBOS" });
  const item = { icao: " ABC123 ", callsign: "BAW183" };

  state.coordinator.update(item, state.publish);
  await Promise.resolve();
  await Promise.resolve();

  expect(state.changes).toEqual([
    item,
    { ...item, aircraftTypeCode: "B738" },
    { ...item, aircraftTypeCode: "B738", origin: "EGLL", destination: "KBOS" },
  ]);
  expect(state.coordinator.enrich(item)).toMatchObject({ aircraftTypeCode: "B738" });
  expect(state.lookup.getAircraftType).toHaveBeenCalledWith("ABC123");
  expect(state.lookup.getCallsignRoute).toHaveBeenCalledWith("BAW183");
});

test("skips aircraft without an ICAO and ignores unusable callsigns", async () => {
  const state = createState();
  state.coordinator.update({ callsign: "BAW183" }, state.publish);
  state.coordinator.update({ icao: "DEF456", callsign: "AD" }, state.publish);
  await Promise.resolve();

  expect(state.changes).toEqual([{ icao: "DEF456", callsign: "AD" }]);
  expect(state.lookup.getAircraftType).toHaveBeenCalledWith("DEF456");
  expect(state.lookup.getCallsignRoute).not.toHaveBeenCalled();
});

test("does not apply an old route to a new callsign", async () => {
  const state = createState();
  const complete = [];
  state.lookup.getCallsignRoute.mockImplementation(
    () => new Promise((resolve) => complete.push(resolve)),
  );
  const first = { icao: "ABC123", callsign: "BAW183" };
  const second = { ...first, callsign: "AFR012" };
  state.coordinator.update(first, state.publish);
  state.coordinator.update(second, state.publish);
  complete[0]({ origin: "EGLL", destination: "KBOS" });
  await Promise.resolve();
  expect(state.changes.at(-1)).toEqual(second);
  complete[1]({ origin: "LFPG", destination: "KJFK" });
  await Promise.resolve();
  expect(state.changes.at(-1)).toMatchObject({ origin: "LFPG", destination: "KJFK" });
});

test("keeps partial route data and ignores empty or failed lookups", async () => {
  const state = createState();
  const item = { icao: "ABC123", callsign: "BAW183" };
  state.lookup.getCallsignRoute.mockResolvedValueOnce({ destination: "KBOS" });
  state.coordinator.update(item, state.publish);
  await Promise.resolve();
  expect(state.changes.at(-1)).toEqual({ ...item, destination: "KBOS" });

  state.lookup.getCallsignRoute.mockResolvedValueOnce(null);
  state.lookup.getCallsignRoute.mockRejectedValueOnce(new Error("offline"));
  state.lookup.getAircraftType.mockRejectedValueOnce(new Error("offline"));
  state.coordinator.update({ ...item, callsign: "BAW184" }, state.publish);
  state.coordinator.update({ ...item, callsign: "BAW185" }, state.publish);
  await Promise.resolve();
  await Promise.resolve();
  expect(state.changes).toHaveLength(4);
});

test("retains route data when a placeholder replaces a useful callsign", async () => {
  const state = createState();
  state.lookup.getCallsignRoute.mockResolvedValue({ origin: "EGLL", destination: "KBOS" });
  const aircraft = { icao: "ABC123", callsign: "BAW183" };
  state.coordinator.update(aircraft, state.publish);
  await Promise.resolve();
  state.lookup.getAircraftType.mockResolvedValue({ aircraftTypeCode: "B738" });
  state.coordinator.update({ ...aircraft, callsign: "AD" }, state.publish);
  await Promise.resolve();
  expect(state.changes.at(-1)).toMatchObject({
    callsign: "BAW183",
    aircraftTypeCode: "B738",
    origin: "EGLL",
    destination: "KBOS",
  });
});

test("skips lookups when re-api metadata already has type and complete route fields", () => {
  const state = createState();
  state.coordinator.update(
    {
      icao: "ABC123",
      callsign: "BAW183",
      aircraftTypeCode: "B738",
      origin: "EGLL",
      destination: "KBOS",
    },
    state.publish,
  );
  expect(state.lookup.getAircraftType).not.toHaveBeenCalled();
  expect(state.lookup.getCallsignRoute).not.toHaveBeenCalled();
});

test("pauses route lookups and ignores results started before they were disabled", async () => {
  const state = createState();
  let complete;
  state.lookup.getCallsignRoute.mockImplementation(
    () => new Promise((resolve) => (complete = resolve)),
  );
  const item = { icao: "ABC123", callsign: "BAW183" };
  state.coordinator.update(item, state.publish);
  state.coordinator.setRouteLookupsEnabled(false);
  state.coordinator.setRouteLookupsEnabled(false);
  complete({ origin: "EGLL", destination: "KBOS" });
  await Promise.resolve();
  expect(state.changes).toEqual([item]);
  state.coordinator.update({ ...item, altitudeFeet: 10000 }, state.publish);
  expect(state.lookup.getCallsignRoute).toHaveBeenCalledTimes(1);
  state.coordinator.setRouteLookupsEnabled(true);
  state.coordinator.update({ ...item, altitudeFeet: 11000 }, state.publish);
  expect(state.lookup.getCallsignRoute).toHaveBeenCalledTimes(2);
});
