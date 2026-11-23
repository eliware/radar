import { default as latitudeToWaterTile } from "./latitude-to-tile.mjs";
import { default as longitudeToWaterTile } from "./longitude.mjs";

function projectWaterTileRange(minLongitude, maxLongitude, minLatitude, maxLatitude, zoom) {
  return {
    minX: longitudeToWaterTile(minLongitude, zoom),
    maxX: longitudeToWaterTile(maxLongitude, zoom),
    minY: latitudeToWaterTile(maxLatitude, zoom),
    maxY: latitudeToWaterTile(minLatitude, zoom),
  };
}
export default projectWaterTileRange;
