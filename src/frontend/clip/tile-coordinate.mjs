export function tilePointToCoordinate(point, tile, extent) {
  const size = 2 ** tile.z;
  const x = (tile.x + point.x / extent) / size;
  const y = (tile.y + point.y / extent) / size;
  return {
    longitude: x * 360 - 180,
    latitude: (Math.atan(Math.sinh(Math.PI * (1 - 2 * y))) * 180) / Math.PI,
  };
}
