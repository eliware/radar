import { expect, test } from "@jest/globals";
import {
  cameraDistanceToRange,
  rangeToCameraDistance,
} from "../../../src/frontend/radar/camera-range.mjs";

test("converts between visible range and perspective camera distance", () => {
  expect(cameraDistanceToRange(rangeToCameraDistance(20))).toBeCloseTo(20);
  expect(cameraDistanceToRange(rangeToCameraDistance(1))).toBe(1);
  expect(cameraDistanceToRange(rangeToCameraDistance(300))).toBe(300);
});
