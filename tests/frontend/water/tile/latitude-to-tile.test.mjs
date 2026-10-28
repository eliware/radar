import { expect, test } from "@jest/globals";
import { latitudeToWaterTile } from "../../../../src/frontend/water/tile/latitude-to-tile.mjs";

test("projects latitude to a Web Mercator tile row", () => {
  expect(latitudeToWaterTile(90, 2)).toBe(0);
  expect(latitudeToWaterTile(0, 2)).toBe(2);
});
