import { expect, test } from "@jest/globals";
import { selectWaterTiles } from "../../../../src/frontend/water/tile/coordinates.mjs";

test("selects local tiles and zoom levels for the current range", () => {
  const tiles = selectWaterTiles({ latitude: 43.8, longitude: -70.3 }, 20, 8);
  expect(tiles.length).toBeGreaterThan(0);
  expect(tiles.every((tile) => tile.z === 8 && tile.key === `${tile.z}/${tile.x}/${tile.y}`)).toBe(
    true,
  );
});

test("wraps longitude tiles at the antimeridian", () => {
  const tiles = selectWaterTiles({ latitude: 43, longitude: 180 }, 300, 2);
  expect(tiles.length).toBeGreaterThan(0);
  expect(tiles.every(({ x }) => x >= 0 && x < 4)).toBe(true);
});
