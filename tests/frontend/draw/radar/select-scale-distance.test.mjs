import { expect, test } from "@jest/globals";
import { selectScaleDistance } from "../../../../src/frontend/draw/radar/select-scale-distance.mjs";

test.each([
  [20, 475.2, 120, 5],
  [60, 120, 120, 50],
  [300, 1, 120, 200],
  [1, 140.8, 120, 1],
])("selects a useful scale for range %s", (range, radius, maxLength, expected) => {
  expect(selectScaleDistance(range, radius, maxLength)).toBe(expected);
});
