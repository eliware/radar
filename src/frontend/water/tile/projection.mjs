import { latitudeToWaterTile } from "./latitude-to-tile.mjs";
import { longitudeToWaterTile } from "./longitude.mjs";

export function projectWaterTileRange(minLongitude, maxLongitude, minLatitude, maxLatitude, zoom) {
  return {
    minX: longitudeToWaterTile(minLongitude, zoom),
    maxX: longitudeToWaterTile(maxLongitude, zoom),
    minY: latitudeToWaterTile(maxLatitude, zoom),
    maxY: latitudeToWaterTile(minLatitude, zoom),
  };
}
