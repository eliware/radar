import { expect, test } from "@jest/globals";
import { createMergedAircraftState } from "../../../../src/backend/aircraft/merged/aircraft-state.mjs";

test("merges local precedence, remote fallbacks, sorting, and local range", () => {
  const state = createMergedAircraftState();
  state.replaceRemote([
    { icao: "abc123", distanceNauticalMiles: 5, altitudeFeet: 9000, callsign: "REMOTE" },
    { icao: "DEF456", distanceNauticalMiles: 2 },
  ]);
  state.setLocal({ icao: "ABC123", distanceNauticalMiles: 7, altitudeFeet: 12000, callsign: "" });
  expect(state.list()).toEqual([
    expect.objectContaining({ icao: "DEF456", remoteOnly: true }),
    expect.objectContaining({
      icao: "ABC123",
      distanceNauticalMiles: 7,
      altitudeFeet: 12000,
      callsign: "REMOTE",
      remoteOnly: false,
    }),
  ]);
  expect(state.localFurthestDistanceNm()).toBe(7);
});

test("replacing source snapshots removes stale entries and ignores invalid ICAOs", () => {
  const state = createMergedAircraftState();
  state.replaceLocal([{ icao: "LOCAL1" }]);
  state.replaceRemote([{ icao: "REMOTE1" }, { icao: " " }]);
  state.replaceLocal([]);
  expect(state.list()).toEqual([{ icao: "REMOTE1", remoteOnly: true }]);
  state.replaceRemote([]);
  expect(state.list()).toEqual([]);
  expect(state.localFurthestDistanceNm()).toBe(0);
});

test("supports local-only entries without distance or remote fields", () => {
  const state = createMergedAircraftState();
  state.replaceLocal([
    { icao: "LOCAL1" },
    { icao: "LOCAL2", distanceNauticalMiles: 3 },
    { icao: "LOCAL3" },
  ]);
  expect(state.list()).toEqual([
    expect.objectContaining({ icao: "LOCAL2", remoteOnly: false }),
    expect.objectContaining({ icao: "LOCAL1", remoteOnly: false }),
    expect.objectContaining({ icao: "LOCAL3", remoteOnly: false }),
  ]);
  expect(state.localFurthestDistanceNm()).toBe(3);
});
