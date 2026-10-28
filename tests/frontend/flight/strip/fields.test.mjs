import { expect, test } from "@jest/globals";
import { formatAircraftStripFields } from "../../../../src/frontend/flight/strip/fields.mjs";

test("formats altitude, heading, speed, bearing, and route fields", () => {
  expect(
    formatAircraftStripFields({
      icao: "ABC123",
      callsign: "RADAR1",
      altitudeFeet: 12500,
      verticalRateFeetPerMinute: -640,
      trackDegrees: 9,
      groundSpeedKnots: 200,
      distanceNauticalMiles: 4.2,
      bearingDegrees: 7,
      aircraftTypeCode: "B738",
      squawk: "1200",
      origin: "KPWM",
      destination: "KBOS",
    }),
  ).toEqual({
    altitude: "125-06",
    aircraftType: "B738",
    headingAndSpeed: "009°200",
    squawk: "1200",
    bearingAndRange: "007°4",
    origin: "KPWM",
    destination: "KBOS",
  });
});

test("formats placeholders and combined heading-speed fields", () => {
  expect(formatAircraftStripFields({ icao: "A1B2C3" })).toMatchObject({
    altitude: "-",
    aircraftType: "-",
    headingAndSpeed: "-",
    bearingAndRange: "-",
    origin: "-",
    destination: "-",
  });
  expect(formatAircraftStripFields({ trackDegrees: 359 }).headingAndSpeed).toBe("359°-");
  expect(formatAircraftStripFields({ groundSpeedKnots: 457 }).headingAndSpeed).toBe("-457");
});
