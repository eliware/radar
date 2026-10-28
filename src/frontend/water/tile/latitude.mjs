export function clampWaterLatitude(latitude) {
  return Math.max(-85.0511, Math.min(85.0511, latitude));
}
