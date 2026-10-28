import { expect, test } from "@jest/globals";
import { calculateWaterTileBounds } from "../../../../src/frontend/water/tile/bounds.mjs";

test("calculates tile bounds around a view center", () => {
  const bounds = calculateWaterTileBounds({ latitude: 43.8, longitude: -70.3 }, 20, 8);
  expect(bounds.minX).toBeLessThanOrEqual(bounds.maxX);
  expect(bounds.minY).toBeLessThanOrEqual(bounds.maxY);
});

test("clamps polar view bounds to the Web Mercator latitude limits", () => {
  const north = calculateWaterTileBounds({ latitude: 89, longitude: 0 }, 300, 2);
  const south = calculateWaterTileBounds({ latitude: -89, longitude: 0 }, 300, 2);
  expect(north.minY).toBeGreaterThanOrEqual(0);
  expect(north.maxY).toBeLessThanOrEqual(4);
  expect(south.minY).toBeGreaterThanOrEqual(0);
  expect(south.maxY).toBeLessThanOrEqual(4);
});
