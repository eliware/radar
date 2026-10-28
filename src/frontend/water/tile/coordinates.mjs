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

export function selectWaterZoom(latitude, rangeNm) {
  const diameterMeters = (rangeNm * 2 * 1.6 * 1852) / 0.88;
  const worldMeters = 40075016.686 * Math.cos((latitude * Math.PI) / 180);
  return Math.max(0, Math.min(14, Math.floor(Math.log2(worldMeters / diameterMeters))));
}
