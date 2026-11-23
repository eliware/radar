import { default as clampWaterLatitude } from "./latitude.mjs";
import { default as projectWaterTileRange } from "./projection.mjs";

function calculateWaterTileBounds(center, rangeNm, tileZoom) {
  const radius = Math.max(1, rangeNm) * 1.6;
  const minLat = clampWaterLatitude(center.latitude - radius / 60);
  const maxLat = clampWaterLatitude(center.latitude + radius / 60);
  const longitudeRadius =
    radius / (60 * Math.max(0.05, Math.cos((center.latitude * Math.PI) / 180)));
  const bounds = projectWaterTileRange(
    center.longitude - longitudeRadius,
    center.longitude + longitudeRadius,
    minLat,
    maxLat,
    tileZoom,
  );
  const lastTile = 2 ** tileZoom - 1;
  return {
    ...bounds,
    minY: Math.max(0, Math.min(lastTile, bounds.minY)),
    maxY: Math.max(0, Math.min(lastTile, bounds.maxY)),
  };
}
export default calculateWaterTileBounds;
