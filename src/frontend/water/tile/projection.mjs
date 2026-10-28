export function clampWaterLatitude(latitude) {
  return Math.max(-85.0511, Math.min(85.0511, latitude));
}

export function longitudeToWaterTile(longitude, zoom) {
  return Math.floor(((longitude + 180) / 360) * 2 ** zoom);
}

export function latitudeToWaterTile(latitude, zoom) {
  const radians = (clampWaterLatitude(latitude) * Math.PI) / 180;
  return Math.floor(((1 - Math.asinh(Math.tan(radians)) / Math.PI) / 2) * 2 ** zoom);
}

export function projectWaterTileRange(minLongitude, maxLongitude, minLatitude, maxLatitude, zoom) {
  return {
    minX: longitudeToWaterTile(minLongitude, zoom),
    maxX: longitudeToWaterTile(maxLongitude, zoom),
    minY: latitudeToWaterTile(maxLatitude, zoom),
    maxY: latitudeToWaterTile(minLatitude, zoom),
  };
}
