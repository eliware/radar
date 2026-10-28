import { expect, jest, test } from "@jest/globals";
import { decodeWaterLayer } from "../../../../src/frontend/water/tile/decoder.mjs";

test("filters water features and converts their rings to coordinates", () => {
  const ring = [
    { x: 100, y: 100 },
    { x: 200, y: 100 },
    { x: 200, y: 200 },
  ];
  const lake = { properties: { class: "lake" }, loadGeometry: jest.fn(() => [ring]) };
  const river = { properties: { class: "river" }, loadGeometry: jest.fn(() => [ring]) };
  const layer = { length: 2, extent: 4096, feature: (index) => [lake, river][index] };

  const paths = decodeWaterLayer(layer, { z: 1, x: 1, y: 1 });

  expect(paths).toHaveLength(1);
  expect(paths[0]).toHaveLength(4);
  expect(lake.loadGeometry).toHaveBeenCalledTimes(1);
  expect(river.loadGeometry).not.toHaveBeenCalled();
});

test("returns no paths for rings with fewer than three points", () => {
  const layer = {
    length: 1,
    extent: 4096,
    feature: () => ({ properties: { class: "ocean" }, loadGeometry: () => [[{ x: 1, y: 1 }]] }),
  };

  expect(decodeWaterLayer(layer, { z: 0, x: 0, y: 0 })).toEqual([]);
});
