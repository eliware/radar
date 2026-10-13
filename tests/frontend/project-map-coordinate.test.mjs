import { expect, test } from "@jest/globals";
import { projectMapCoordinate } from "../../src/frontend/project-map-coordinate.mjs";

test("projects map coordinates near the home point", () => {
  const point = projectMapCoordinate([-69.9, 43.1], { latitude: 43, longitude: -70 }, 300);
  expect(point.x).toBeCloseTo(4.39, 1);
  expect(point.y).toBeLessThan(0);
  expect(point.z).toBeCloseTo(-6);
});

test("wraps longitude across the date line", () => {
  const point = projectMapCoordinate([-179.9, 0], { latitude: 0, longitude: 179.9 });
  expect(point.x).toBeCloseTo(12);
});

test.each([
  [null, { latitude: 0, longitude: 0 }],
  [[0, 0], null],
  [[Number.NaN, 0], { latitude: 0, longitude: 0 }],
  [[0, Number.NaN], { latitude: 0, longitude: 0 }],
])("rejects invalid map point %j", (coordinate, location) => {
  expect(projectMapCoordinate(coordinate, location)).toBeNull();
});
