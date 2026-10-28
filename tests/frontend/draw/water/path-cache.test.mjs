import { expect, test } from "@jest/globals";
import { getProjectedWaterPaths } from "../../../../src/frontend/draw/water/path-cache.mjs";

test("caches projected paths for the same paths and location", () => {
  const paths = [
    [
      { latitude: 1, longitude: 2 },
      { latitude: 1.1, longitude: 2.1 },
      { latitude: Number.NaN, longitude: 2 },
    ],
  ];
  const location = { latitude: 1, longitude: 2 };
  const first = getProjectedWaterPaths(paths, location);
  expect(getProjectedWaterPaths(paths, location)).toBe(first);
  expect(first[0].points).toHaveLength(4);
  expect(first[0].bounds.minX).toBeLessThanOrEqual(first[0].bounds.maxX);
});
