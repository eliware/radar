import { expect, jest, test } from "@jest/globals";
import { aircraftRowsOf, aircraftValuesOf } from "../../../../src/cli/flight/strip/rows.mjs";

test("formats aircraft fields for flight strip columns", () => {
  expect(
    aircraftValuesOf(
      {
        callsign: "TEST123",
        icao: "ABC123",
        altitudeFeet: 12000,
        groundSpeedKnots: 250,
        trackDegrees: 31,
        verticalRateFeetPerMinute: -500,
        squawk: "1200",
        latitude: 43.68745965,
        longitude: -70.4425048,
        distanceNauticalMiles: 1.5,
        bearingDegrees: 270,
        lastSeen: 1000,
      },
      4000,
    ),
  ).toEqual([
    "TEST123",
    "ABC123",
    "12,000 ft",
    "250 kt",
    "031°",
    "-500 fpm",
    "1200",
    "43.6875, -70.4425",
    "1.5 nm",
    "270°",
    "3s",
  ]);
});

test("formats missing fields and invalid positions safely", () => {
  expect(aircraftValuesOf({ lastSeen: 5000, latitude: "43", longitude: -70 }, 4000)).toEqual([
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "0s",
  ]);
});

test("formats each aircraft using the supplied clock once per row", () => {
  const now = jest.fn(() => 4000);
  const rows = aircraftRowsOf([{ lastSeen: 1000 }, { lastSeen: 2000 }], now);
  expect(rows).toHaveLength(2);
  expect(rows[0].at(-1)).toBe("3s");
  expect(rows[1].at(-1)).toBe("2s");
  expect(now).toHaveBeenCalledTimes(2);
});

test("defaults to the current clock", () => {
  expect(aircraftRowsOf([])).toEqual([]);
});
