import { clampWaterLatitude } from "./latitude.mjs";
import { projectWaterTileRange } from "./projection.mjs";

export function calculateWaterTileBounds(center, rangeNm, tileZoom) {
  const radius = Math.max(1, rangeNm) * 1.6;
  const minLat = clampWaterLatitude(center.latitude - radius / 60);
  const maxLat = clampWaterLatitude(center.latitude + radius / 60);
  const longitudeRadius =
    radius / (60 * Math.max(0.05, Math.cos((center.latitude * Math.PI) / 180)));
  return projectWaterTileRange(
    center.longitude - longitudeRadius,
    center.longitude + longitudeRadius,
    minLat,
    maxLat,
    tileZoom,
  );
}
