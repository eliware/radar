import { expect, test } from "@jest/globals";
import { selectDefaultRadarRange } from "../../../src/frontend/radar/default-range.mjs";

test("selects a default range beyond the furthest finite target", () => {
  expect(selectDefaultRadarRange([])).toBe(20);
  expect(selectDefaultRadarRange([12, 14.5])).toBe(20);
  expect(selectDefaultRadarRange([12, 19.5])).toBe(24.5);
  expect(selectDefaultRadarRange([Number.NaN, 400])).toBe(300);
  expect(selectDefaultRadarRange([], 25)).toBe(25);
  expect(selectDefaultRadarRange([24], 25)).toBe(29);
});
