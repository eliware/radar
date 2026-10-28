import { expect, test } from "@jest/globals";
import { clampWaterLatitude } from "../../../../src/frontend/water/tile/latitude.mjs";

test("clamps latitude to the Web Mercator tile boundary", () => {
  expect(clampWaterLatitude(90)).toBe(85.0511);
  expect(clampWaterLatitude(-90)).toBe(-85.0511);
});
