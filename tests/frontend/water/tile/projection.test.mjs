import { expect, test } from "@jest/globals";
import {
  clampWaterLatitude,
  latitudeToWaterTile,
  longitudeToWaterTile,
  projectWaterTileRange,
} from "../../../../src/frontend/water/tile/projection.mjs";

test("projects longitude and latitude into tile indices", () => {
  expect(longitudeToWaterTile(0, 2)).toBe(2);
  expect(latitudeToWaterTile(0, 2)).toBe(2);
  expect(projectWaterTileRange(-10, 10, -10, 10, 2)).toEqual({
    minX: 1,
    maxX: 2,
    minY: 1,
    maxY: 2,
  });
});

test("clamps latitude to the Web Mercator tile boundary", () => {
  expect(clampWaterLatitude(90)).toBe(85.0511);
  expect(clampWaterLatitude(-90)).toBe(-85.0511);
  expect(latitudeToWaterTile(90, 2)).toBe(0);
});
