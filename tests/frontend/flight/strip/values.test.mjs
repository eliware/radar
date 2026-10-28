import { expect, test } from "@jest/globals";
import { valuesOf } from "../../../../src/frontend/flight/strip/values.mjs";

const fullAircraft = {
  icao: "ABC123",
  callsign: "RADAR1",
  altitudeFeet: 12500,
  groundSpeedKnots: 200,
  trackDegrees: 9,
  verticalRateFeetPerMinute: -640,
  squawk: "1200",
  aircraftTypeCode: "B738",
  distanceNauticalMiles: 4.2,
  bearingDegrees: 7,
  origin: "KPWM",
  destination: "KBOS",
};

test("formats strip fields from aircraft values", () => {
  expect(valuesOf(fullAircraft)).toEqual([
    "RADAR1",
    "125-06",
    "B738",
    "009°200",
    "1200",
    "",
    "007°4",
    "KPWM",
    "KBOS",
  ]);
});

test("uses callsign placeholders for records without identity", () => {
  expect(valuesOf({})[0]).toBe("-");
});
