import { expect, test } from "@jest/globals";
import { selectWaterTileLayer } from "../../../../src/frontend/water/tile/layer-selection.mjs";

test("selects the water layer and returns null when it is absent", () => {
  const water = { length: 0 };
  expect(selectWaterTileLayer({ layers: { water } })).toBe(water);
  expect(selectWaterTileLayer({ layers: {} })).toBeNull();
  expect(selectWaterTileLayer({})).toBeNull();
});
