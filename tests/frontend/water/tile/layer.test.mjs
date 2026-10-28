import { expect, jest, test } from "@jest/globals";
import { decodeWaterLayer } from "../../../../src/frontend/water/tile/layer.mjs";

test("selects ocean and lake features and converts their rings", () => {
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

test("returns no paths for rings with fewer than three points", () => {
  const layer = fakeLayer([feature("ocean", [[{ x: 1, y: 1 }]])]);
  expect(decodeWaterLayer(layer, { z: 0, x: 0, y: 0 })).toEqual([]);
});

function feature(kind, geometries) {
  return { properties: { class: kind }, loadGeometry: jest.fn(() => geometries) };
}

function fakeLayer(features) {
  return { extent: 4096, length: features.length, feature: (index) => features[index] };
}
