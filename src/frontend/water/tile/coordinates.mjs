import { clampWaterLatitude, projectWaterTileRange } from "./projection.mjs";

export function selectWaterTiles(center, rangeNm, tileZoom) {
  const radius = Math.max(1, rangeNm) * 1.6;
  const minLat = clampWaterLatitude(center.latitude - radius / 60);
  const maxLat = clampWaterLatitude(center.latitude + radius / 60);
  const longitudeRadius =
    radius / (60 * Math.max(0.05, Math.cos((center.latitude * Math.PI) / 180)));
  const { minX, maxX, minY, maxY } = projectWaterTileRange(
    center.longitude - longitudeRadius,
    center.longitude + longitudeRadius,
    minLat,
    maxLat,
    tileZoom,
  );
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
