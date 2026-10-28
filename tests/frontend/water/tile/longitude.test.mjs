import { expect, test } from "@jest/globals";
import { longitudeToWaterTile } from "../../../../src/frontend/water/tile/longitude.mjs";

test("projects longitude into a tile index", () => {
  expect(longitudeToWaterTile(0, 2)).toBe(2);
});
