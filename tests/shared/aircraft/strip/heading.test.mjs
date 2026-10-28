import { expect, test } from "@jest/globals";
import { formatAircraftStripHeading } from "../../../../src/shared/aircraft/strip/heading.mjs";

test("formats shared flight strip heading", () => {
  expect(formatAircraftStripHeading({ trackDegrees: 359.6 })).toBe("000°");
  expect(formatAircraftStripHeading({ trackDegrees: Number.NaN })).toBe("-");
});
