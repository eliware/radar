import { expect, test } from "@jest/globals";
import { clipWaterTileRing } from "../../../src/frontend/clip/water-tile-ring.mjs";

test("converts a ring that does not touch the tile edge", () => {
  const paths = clipWaterTileRing(
    [
      { x: 10, y: 10 },
      { x: 20, y: 10 },
      { x: 20, y: 20 },
      { x: 10, y: 20 },
    ],
    { z: 1, x: 1, y: 1 },
    4096,
  );
  expect(paths).toHaveLength(1);
  expect(paths[0]).toHaveLength(5);
  expect(paths[0][0].longitude).toBeGreaterThan(-180);
  expect(paths[0][0].latitude).toBeLessThan(0);
});

test("splits a ring at tile edges and keeps only useful path segments", () => {
  const paths = clipWaterTileRing(
    [
      { x: 0, y: 0 },
      { x: 0, y: 10 },
      { x: 10, y: 10 },
      { x: 20, y: 5 },
      { x: 10, y: 0 },
    ],
    { z: 1, x: 1, y: 1 },
    20,
  );
  expect(paths).toHaveLength(1);
  expect(paths[0]).toHaveLength(4);
});

test("drops rings with fewer than three points and edge-only rings", () => {
  expect(
    clipWaterTileRing(
      [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
      ],
      { z: 0, x: 0, y: 0 },
      10,
    ),
  ).toEqual([]);
  expect(
    clipWaterTileRing(
      [
        { x: 0, y: 0 },
        { x: 0, y: 10 },
        { x: 10, y: 10 },
        { x: 10, y: 0 },
      ],
      { z: 0, x: 0, y: 0 },
      10,
    ),
  ).toEqual([]);
});

test.each([
  [
    { x: 4160, y: 1000 },
    { x: 4160, y: 4000 },
    { x: 4200, y: 4000 },
    { x: 4200, y: 1000 },
  ],
  [
    { x: 1000, y: 4160 },
    { x: 4000, y: 4160 },
    { x: 4000, y: 4200 },
    { x: 1000, y: 4200 },
  ],
])("drops water edges on the vector tile buffer: %j", (ring) => {
  expect(clipWaterTileRing(ring, { z: 7, x: 38, y: 46 }, 4096)).toEqual([]);
});
