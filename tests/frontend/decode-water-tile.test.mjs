import { expect, jest, test } from "@jest/globals";
import { decodeWaterLayer, decodeWaterTile } from "../../src/frontend/decode-water-tile.mjs";

test("selects ocean and lake features from a vector tile", () => {
  const lake = feature("lake", [
    [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ],
  ]);
  const ocean = feature("ocean", [
    [
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 4, y: 4 },
    ],
  ]);
  const river = feature("river", [
    [
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 6, y: 6 },
    ],
  ]);
  const paths = decodeWaterLayer(fakeLayer([lake, ocean, river]), { z: 1, x: 1, y: 1 });
  expect(paths).toHaveLength(2);
  expect(lake.loadGeometry).toHaveBeenCalledTimes(1);
  expect(ocean.loadGeometry).toHaveBeenCalledTimes(1);
  expect(river.loadGeometry).not.toHaveBeenCalled();
});

test("returns no paths when the vector tile has no water layer", () => {
  expect(
    decodeWaterTile(new Uint8Array([26, 11, 10, 5, 119, 97, 116, 101, 114, 18, 0, 120, 2]).buffer, {
      z: 1,
      x: 1,
      y: 1,
    }),
  ).toEqual([]);
  expect(decodeWaterTile(new ArrayBuffer(0), { z: 0, x: 0, y: 0 })).toEqual([]);
});

function feature(kind, geometries) {
  return { properties: { class: kind }, loadGeometry: jest.fn(() => geometries) };
}

function fakeLayer(features) {
  return { extent: 4096, length: features.length, feature: (index) => features[index] };
}
