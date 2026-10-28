import { expect, test } from "@jest/globals";
import { aircraftFieldsOf } from "../../../../src/cli/flight/strip/values.mjs";

test("formats aircraft fields for flight strip columns", () => {
  expect(
    aircraftFieldsOf(
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
  ).toEqual({
    callsign: "TEST123",
    icao: "ABC123",
    altitude: "12,000 ft",
    groundSpeed: "250 kt",
    heading: "031°",
    verticalRate: "-500 fpm",
    squawk: "1200",
    position: "43.6875, -70.4425",
    distance: "1.5 nm",
    bearing: "270°",
    age: "3s",
  });
});

test("formats missing fields and invalid positions safely", () => {
  expect(aircraftFieldsOf({ lastSeen: 5000, latitude: "43", longitude: -70 }, 4000)).toEqual({
    callsign: "-",
    icao: "-",
    altitude: "-",
    groundSpeed: "-",
    heading: "-",
    verticalRate: "-",
    squawk: "-",
    position: "-",
    distance: "-",
    bearing: "-",
    age: "0s",
  });
});
