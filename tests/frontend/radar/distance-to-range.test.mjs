import { expect, test } from "@jest/globals";
import { cameraDistanceToRange } from "../../../src/frontend/radar/distance-to-range.mjs";

test("converts perspective camera distance to nautical-mile range", () => {
  const distance = 20 / (2 * 0.44 * Math.tan((48 * Math.PI) / 360));
  expect(cameraDistanceToRange(distance)).toBeCloseTo(20);
  expect(cameraDistanceToRange(0)).toBe(1);
});
