import { expect, jest, test } from "@jest/globals";
import { decodeWaterLayer, decodeWaterTile } from "../../src/frontend/decode-water-tile.mjs";

test("decodes lake and ocean geometry and skips tile edge lines", () => {
  const layer = fakeLayer([
    feature("lake", [
      [
        { x: 10, y: 10 },
        { x: 20, y: 10 },
        { x: 20, y: 20 },
        { x: 10, y: 20 },
      ],
    ]),
    feature("ocean", [
      [
        { x: 0, y: 10 },
        { x: 0, y: 20 },
        { x: 10, y: 20 },
        { x: 10, y: 10 },
      ],
    ]),
    feature("river", [
      [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
      ],
    ]),
    feature("lake", [
      [
        { x: 0, y: 0 },
        { x: 0, y: 10 },
        { x: 10, y: 0 },
      ],
    ]),
    feature("lake", [
      [
        { x: 0, y: 0 },
        { x: 0, y: 10 },
        { x: 10, y: 10 },
        { x: 20, y: 5 },
        { x: 10, y: 0 },
      ],
    ]),
  ]);
  const paths = decodeWaterLayer(layer, { z: 1, x: 1, y: 1 });
  expect(paths).toHaveLength(3);
  expect(paths[0][0].longitude).toBeGreaterThan(-180);
  expect(paths[1].length).toBeGreaterThan(2);
});

test("skips short paths and returns no paths when the tile has no water layer", () => {
  expect(
    decodeWaterLayer(
      fakeLayer([
        feature("lake", [
          [
            { x: 2, y: 2 },
            { x: 3, y: 3 },
          ],
        ]),
      ]),
      { z: 0, x: 0, y: 0 },
    ),
  ).toEqual([]);
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
