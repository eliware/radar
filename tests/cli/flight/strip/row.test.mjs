import { expect, test } from "@jest/globals";
import { aircraftValuesOf } from "../../../../src/cli/flight/strip/row.mjs";

test("assembles formatted aircraft fields in flight strip column order", () => {
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
