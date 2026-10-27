import { expect, test } from "@jest/globals";
import { formatAircraftSpeed } from "../../../src/frontend/aircraft/speed.mjs";

test("formats finite ground speed as rounded knots and missing speed as a dash", () => {
  expect(formatAircraftSpeed({ groundSpeedKnots: 401.6 })).toBe("402");
  expect(formatAircraftSpeed({ groundSpeedKnots: Number.NaN })).toBe("-");
  expect(formatAircraftSpeed({})).toBe("-");
});
