import { expect, test } from "@jest/globals";
import { getRadarLabelGapAngle } from "../../../src/frontend/radar/label-gap-angle.mjs";

test("calculates a label gap angle within its ring", () => {
  expect(getRadarLabelGapAngle(10, 8, 0)).toBeCloseTo(2 * Math.asin(0.4));
  expect(getRadarLabelGapAngle(10, 0, 0)).toBe(0);
  expect(getRadarLabelGapAngle(1, 20, 0)).toBeCloseTo(2 * Math.asin(0.999));
});
