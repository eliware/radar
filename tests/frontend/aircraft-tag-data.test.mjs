import { expect, test } from "@jest/globals";
import { formatAircraftTag } from "../../src/frontend/aircraft-tag-data.mjs";

test("formats the name, flight level, and speed without units", () => {
  expect(
    formatAircraftTag({
      callsign: " TEST ",
      altitudeFeet: 12300,
      verticalRateFeetPerMinute: 2150,
      groundSpeedKnots: 401.6,
    }),
  ).toEqual(["TEST", "123+22", "402"]);
  expect(
    formatAircraftTag({ icao: "ABC", altitudeFeet: 12300, verticalRateFeetPerMinute: -2150 }),
  ).toEqual(["ABC", "123-22", "-"]);
  expect(formatAircraftTag({ altitudeFeet: 12300, verticalRateFeetPerMinute: 100 })).toEqual([
    "-",
    "123C",
    "-",
  ]);
  expect(formatAircraftTag({ callsign: "OK", icao: "ABC123" })[0]).toBe("ABC123");
  expect(formatAircraftTag({ callsign: "rm", icao: "DEF456" })[0]).toBe("DEF456");
  expect(formatAircraftTag({ callsign: "AD", icao: "A1B2C3" })[0]).toBe("A1B2C3");
  expect(formatAircraftTag({ callsign: "Unknown", icao: "FEDCBA" })[0]).toBe("FEDCBA");
  expect(
    formatAircraftTag({ altitudeFeet: Number.NaN, verticalRateFeetPerMinute: Number.NaN }),
  ).toEqual(["-", "-", "-"]);
});
