import { expect, test } from "@jest/globals";
import { formatAircraftTag } from "../../../../src/frontend/aircraft/tag/data.mjs";

test("formats flight level and speed without units", () => {
  expect(
    formatAircraftTag({
      altitudeFeet: 12300,
      verticalRateFeetPerMinute: 2150,
      groundSpeedKnots: 401.6,
    }).slice(1),
  ).toEqual(["123+22", "402"]);
  expect(formatAircraftTag({ groundSpeedKnots: 496, aircraftTypeCode: "B738" }).slice(1)).toEqual([
    "-",
    "496 B738",
  ]);
  expect(
    formatAircraftTag({ altitudeFeet: 12300, verticalRateFeetPerMinute: -2150 }).slice(1),
  ).toEqual(["123-22", "-"]);
  expect(
    formatAircraftTag({ altitudeFeet: 12300, verticalRateFeetPerMinute: 100 }).slice(1),
  ).toEqual(["123C", "-"]);
  expect(formatAircraftTag({ altitudeFeet: 9500 })[1]).toBe("095");
  expect(formatAircraftTag({ altitudeFeet: 5000, verticalRateFeetPerMinute: 100 })[1]).toBe("050C");
  expect(formatAircraftTag({ altitudeFeet: 10000 })[1]).toBe("100");
  expect(formatAircraftTag({ altitudeFeet: -500 })[1]).toBe("-05");
  expect(
    formatAircraftTag({ altitudeFeet: Number.NaN, verticalRateFeetPerMinute: Number.NaN }),
  ).toEqual(["-", "-", "-"]);
});

test("keeps emergency status out of the three aircraft label lines", () => {
  expect(formatAircraftTag({ callsign: "TEST", squawk: "7500" })).toEqual(["TEST", "-", "-"]);
  expect(formatAircraftTag({ callsign: "TEST", emergency: 1 })).toEqual(["TEST", "-", "-"]);
});
