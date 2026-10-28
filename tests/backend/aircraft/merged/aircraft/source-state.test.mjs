import { expect, test } from "@jest/globals";
import { createMergedAircraftSourceState } from "../../../../../src/backend/aircraft/merged/aircraft/source-state.mjs";

test("normalizes and assigns valid aircraft source records", () => {
  const entries = new Map();
  const state = createMergedAircraftSourceState(entries);
  expect(state.set("local", { icao: " abc123 " })).toBe("ABC123");
  expect(state.set("remote", { icao: "ABC123", callsign: "RPA1" })).toBe("ABC123");
  expect(entries.get("ABC123")).toEqual({
    local: { icao: " abc123 " },
    remote: { icao: "ABC123", callsign: "RPA1" },
  });
});

test("ignores records without a usable ICAO", () => {
  const entries = new Map();
  const state = createMergedAircraftSourceState(entries);
  expect(state.set("local", { icao: " " })).toBeUndefined();
  expect(state.set("local", null)).toBeUndefined();
  expect(entries.size).toBe(0);
});
