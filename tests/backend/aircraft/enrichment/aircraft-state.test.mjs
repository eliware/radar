import { expect, test } from "@jest/globals";
import { createAircraftState } from "../../../../src/backend/aircraft/enrichment/aircraft-state.mjs";

test("normalizes identifiers and merges updates per aircraft", () => {
  const state = createAircraftState();
  expect(state.update({ callsign: "BAW183" })).toBeNull();
  state.update({ icao: " abc123 ", callsign: "BAW183", altitudeFeet: 12000 });
  state.update({ icao: "ABC123", altitudeFeet: 13000 });
  expect(state.get("ABC123")).toEqual({ icao: "ABC123", callsign: "BAW183", altitudeFeet: 13000 });
});

test("retains useful callsigns when placeholder values arrive", () => {
  const state = createAircraftState();
  state.update({ icao: "ABC123", callsign: "BAW183" });
  state.update({ icao: "ABC123", callsign: "AD" });
  expect(state.get("ABC123").callsign).toBe("BAW183");
  state.update({ icao: "ABC123", callsign: "AFR012" });
  expect(state.get("ABC123").callsign).toBe("AFR012");
});

test("retains live records and clears aircraft state", () => {
  const state = createAircraftState();
  state.update({ icao: "ABC123" });
  state.update({ icao: "DEF456" });
  state.retain([{ icao: " abc123 " }]);
  expect(state.get("ABC123")).toBeDefined();
  expect(state.get("DEF456")).toBeUndefined();
  state.clear();
  expect(state.get("ABC123")).toBeUndefined();
});
