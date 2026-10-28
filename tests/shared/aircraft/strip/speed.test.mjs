import { expect, test } from "@jest/globals";
import { formatAircraftStripSpeed } from "../../../../src/shared/aircraft/strip/speed.mjs";

test("formats shared flight strip speed", () => {
  expect(formatAircraftStripSpeed({ groundSpeedKnots: 123.6 })).toBe("124");
  expect(formatAircraftStripSpeed({ groundSpeedKnots: Number.NaN })).toBe("-");
});
