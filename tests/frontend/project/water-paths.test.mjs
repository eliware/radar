import { expect, test } from "@jest/globals";
import { projectWaterPaths } from "../../../src/frontend/project/water-paths.mjs";

test("projects water vertices to MSL zero relative to home elevation", () => {
  const vertices = projectWaterPaths(
    [
      [
        { latitude: 43, longitude: -70 },
        { latitude: 43.1, longitude: -70 },
      ],
    ],
    { latitude: 43, longitude: -70 },
    300,
  );
  expect(vertices).toHaveLength(6);
  expect(vertices[0]).toBe(0);
  expect(vertices[1]).toBeCloseTo(-300 / 6076.12, 6);
  expect(vertices[2]).toBeCloseTo(0, 6);
  expect(vertices[5]).toBeLessThan(0);
});

test("skips invalid points and returns no vertices without a home location", () => {
  const points = [
    { latitude: 43, longitude: -70 },
    { latitude: NaN, longitude: -70 },
  ];
  expect(projectWaterPaths([points], { latitude: 43, longitude: -70 }, 300)).toEqual([]);
  expect(projectWaterPaths([points], null, 300)).toEqual([]);
});
