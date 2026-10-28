import { expect, test } from "@jest/globals";
import {
  clampWaterLatitude,
  latitudeToWaterTile,
} from "../../../../src/frontend/water/tile/latitude.mjs";

test("clamps latitude to the Web Mercator tile boundary", () => {
  expect(clampWaterLatitude(90)).toBe(85.0511);
  expect(clampWaterLatitude(-90)).toBe(-85.0511);
  expect(latitudeToWaterTile(90, 2)).toBe(0);
  expect(latitudeToWaterTile(0, 2)).toBe(2);
});
