export function longitudeToWaterTile(longitude, zoom) {
  return Math.floor(((longitude + 180) / 360) * 2 ** zoom);
}
