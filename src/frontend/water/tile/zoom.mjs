export function selectWaterZoom(latitude, rangeNm) {
  const diameterMeters = (rangeNm * 2 * 1.6 * 1852) / 0.88;
  const worldMeters = 40075016.686 * Math.cos((latitude * Math.PI) / 180);
  return Math.max(0, Math.min(14, Math.floor(Math.log2(worldMeters / diameterMeters))));
}
