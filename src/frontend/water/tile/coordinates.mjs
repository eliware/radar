import { calculateWaterTileBounds } from "./bounds.mjs";

export function selectWaterTiles(center, rangeNm, tileZoom) {
  const { minX, maxX, minY, maxY } = calculateWaterTileBounds(center, rangeNm, tileZoom);
  const size = 2 ** tileZoom;
  const tiles = [];
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const wrappedX = ((x % size) + size) % size;
      tiles.push({ z: tileZoom, x: wrappedX, y, key: `${tileZoom}/${wrappedX}/${y}` });
    }
  }
  return tiles;
}
