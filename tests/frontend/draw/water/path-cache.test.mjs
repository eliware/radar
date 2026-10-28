import { expect, jest, test } from "@jest/globals";
import {
  getProjectedWaterPaths,
  waterPathIntersectsView,
} from "../../../../src/frontend/draw/water/path-cache.mjs";

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

test("checks projected bounds against the viewport", () => {
  const path = { bounds: { minX: 0, maxX: 10, minZ: 0, maxZ: 10 } };
  const project = jest.fn(({ x, z }) => ({ x, y: z }));
  expect(waterPathIntersectsView(path, project, 10, 10)).toBe(true);
  expect(waterPathIntersectsView(path, (point) => ({ x: point.x - 20, y: point.z }), 10, 10)).toBe(
    false,
  );
  expect(waterPathIntersectsView(path, project, undefined, undefined)).toBe(true);
});
