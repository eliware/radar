import { expect, test } from "@jest/globals";
import { createWaterTileUrl } from "../../../../src/frontend/water/tile/url.mjs";

test("fills z, x, and y tile coordinates into the metadata URL template", () => {
  expect(
    createWaterTileUrl({ tiles: ["https://tiles/{z}/{x}/{y}.pbf"] }, { z: 4, x: 7, y: 9 }),
  ).toBe("https://tiles/4/7/9.pbf");
});

test("returns null when tile metadata has no URL template", () => {
  expect(createWaterTileUrl({}, { z: 1, x: 2, y: 3 })).toBeNull();
  expect(createWaterTileUrl({ tiles: [] }, { z: 1, x: 2, y: 3 })).toBeNull();
});
