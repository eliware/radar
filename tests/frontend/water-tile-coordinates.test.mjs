import { expect, test } from "@jest/globals";
import { selectWaterTiles, selectWaterZoom } from "../../src/frontend/water-tile-coordinates.mjs";

test("selects local tiles and zoom levels for the current range", () => {
  const tiles = selectWaterTiles({ latitude: 43.8, longitude: -70.3 }, 20, 8);
  expect(tiles.length).toBeGreaterThan(0);
  expect(tiles.every((tile) => tile.z === 8 && tile.key === `${tile.z}/${tile.x}/${tile.y}`)).toBe(
    true,
  );
  expect(selectWaterZoom(43.8, 20)).toBeGreaterThan(selectWaterZoom(43.8, 300));
  expect(selectWaterZoom(43.8, 1)).toBeLessThanOrEqual(14);
  expect(selectWaterZoom(0, 0)).toBe(14);
  expect(selectWaterZoom(90, 300)).toBe(0);
});

test("wraps longitude tiles and clamps polar tile rows", () => {
  const tiles = selectWaterTiles({ latitude: 89, longitude: 180 }, 300, 2);
  expect(tiles.every(({ x, y }) => x >= 0 && x < 4 && y >= 0 && y < 4)).toBe(true);
  expect(selectWaterTiles({ latitude: -90, longitude: -181 }, 1, 2).length).toBeGreaterThan(0);
});
