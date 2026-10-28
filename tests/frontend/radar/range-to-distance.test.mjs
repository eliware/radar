import { expect, test } from "@jest/globals";
import { rangeToCameraDistance } from "../../../src/frontend/radar/range-to-distance.mjs";

test("converts nautical-mile ranges to perspective camera distance", () => {
  const expected = 20 / (2 * 0.44 * Math.tan((48 * Math.PI) / 360));
  expect(rangeToCameraDistance(20)).toBeCloseTo(expected);
  expect(rangeToCameraDistance(0)).toBeCloseTo(rangeToCameraDistance(1));
});
