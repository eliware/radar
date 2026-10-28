import { expect, test } from "@jest/globals";
import { createMergedAircraftList } from "../../../../../src/backend/aircraft/merged/aircraft/list.mjs";

test("projects merged records in distance order and calculates local range", () => {
  const entries = new Map([
    [
      "ABC123",
      {
        local: { icao: "ABC123", distanceNauticalMiles: 7, callsign: "LOCAL" },
        remote: { icao: "ABC123", callsign: "REMOTE" },
      },
    ],
    ["DEF456", { remote: { icao: "DEF456", distanceNauticalMiles: 2 } }],
    ["LOCAL1", { local: { icao: "LOCAL1" } }],
  ]);
  const list = createMergedAircraftList(entries);
  expect(list.list()).toEqual([
    expect.objectContaining({ icao: "DEF456", remoteOnly: true }),
    expect.objectContaining({ icao: "ABC123", callsign: "LOCAL", remoteOnly: false }),
    expect.objectContaining({ icao: "LOCAL1", remoteOnly: false }),
  ]);
  expect(list.localFurthestDistanceNm()).toBe(7);
});

test("prefers fresh local records and remote fallbacks after local records expire", () => {
  const entries = new Map([
    [
      "ABC123",
      {
        local: { icao: "ABC123", latitude: 43, lastSeen: 17_000 },
        remote: { icao: "ABC123", latitude: 44, lastSeen: 19_000 },
      },
    ],
  ]);
  let now = 20_000;
  const list = createMergedAircraftList(entries, () => now, 8_000);
  expect(list.list()[0].latitude).toBe(43);
  now = 26_000;
  expect(list.list()[0].latitude).toBe(44);
});

test("returns zero when no local record has a finite range", () => {
  expect(createMergedAircraftList(new Map()).localFurthestDistanceNm()).toBe(0);
});
