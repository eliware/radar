import { expect, test } from "@jest/globals";
import {
  clampRadarRange,
  getRadarLabelGapAngle,
  getRadarRingRanges,
  getRadarRingSpacing,
  selectDefaultRadarRange,
} from "../../src/frontend/radar-range.mjs";

test("selects the greater of 20 nautical miles or five miles beyond the furthest target", () => {
  expect(selectDefaultRadarRange([])).toBe(20);
  expect(selectDefaultRadarRange([12, 14.5])).toBe(20);
  expect(selectDefaultRadarRange([12, 19.5])).toBe(24.5);
  expect(selectDefaultRadarRange([Number.NaN, 400])).toBe(300);
  expect(selectDefaultRadarRange([], 25)).toBe(25);
  expect(selectDefaultRadarRange([24], 25)).toBe(29);
});

test("clamps manual ranges between one and 300 nautical miles", () => {
  expect(clampRadarRange(0)).toBe(1);
  expect(clampRadarRange(42)).toBe(42);
  expect(clampRadarRange(301)).toBe(300);
});

test("uses adaptive ring spacing through 300 miles", () => {
  expect(getRadarRingRanges(3)).toEqual([1, 2, 3]);
  expect(getRadarRingRanges(10)).toEqual([5, 10]);
  expect(getRadarRingRanges(20)).toEqual([5, 10, 15, 20]);
  expect(getRadarRingSpacing(20)).toBe(10);
  expect(getRadarRingSpacing(100)).toBe(20);
  expect(getRadarRingSpacing(300)).toBe(50);
  expect(getRadarRingRanges(300)).toHaveLength(12);
  expect(getRadarRingRanges(300).at(-1)).toBe(300);
});

test("keeps label gaps within a ring and accepts zero-width labels", () => {
  expect(getRadarLabelGapAngle(10, 8, 0)).toBeCloseTo(2 * Math.asin(0.4));
  expect(getRadarLabelGapAngle(10, 0, 0)).toBe(0);
  expect(getRadarLabelGapAngle(1, 20, 0)).toBeCloseTo(2 * Math.asin(0.999));
});
