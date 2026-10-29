import { expect, test } from "@jest/globals";
import {
  DEFAULT_RADAR_RANGE,
  MAX_RADAR_RANGE,
  MIN_RADAR_RANGE,
} from "../../../src/frontend/radar/range.mjs";
import { clampRadarRange } from "../../../src/frontend/radar/clamp-range.mjs";
import { getRadarLabelGapAngle } from "../../../src/frontend/radar/label-gap-angle.mjs";
import { getRadarRingRanges } from "../../../src/frontend/radar/ring/ranges.mjs";
import { getRadarRingSpacing } from "../../../src/frontend/radar/ring/spacing.mjs";

test("defines the supported radar range constants", () => {
  expect([MIN_RADAR_RANGE, DEFAULT_RADAR_RANGE, MAX_RADAR_RANGE]).toEqual([1, 20, 300]);
});

test("clamps manual ranges between one and 300 nautical miles", () => {
  expect(clampRadarRange(0)).toBe(1);
  expect(clampRadarRange(42)).toBe(42);
  expect(clampRadarRange(301)).toBe(300);
  expect(clampRadarRange(Number.NaN)).toBe(20);
  expect(clampRadarRange(Number.POSITIVE_INFINITY)).toBe(20);
  expect(clampRadarRange(Number.NEGATIVE_INFINITY)).toBe(20);
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
