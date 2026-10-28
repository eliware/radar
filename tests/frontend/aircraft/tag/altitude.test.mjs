import { expect, test } from "@jest/globals";
import { formatAircraftAltitude } from "../../../../src/frontend/aircraft/tag/altitude.mjs";

test("formats flight level and vertical rate", () => {
  expect(formatAircraftAltitude({ altitudeFeet: 12300, verticalRateFeetPerMinute: 2150 })).toBe(
    "123+22",
  );
  expect(formatAircraftAltitude({ altitudeFeet: 9500 })).toBe("095");
  expect(formatAircraftAltitude({ altitudeFeet: -500 })).toBe("-05");
  expect(formatAircraftAltitude({ altitudeFeet: Number.NaN })).toBe("-");
});
