export function getRadarRingSpacing(range) {
  if (range < 10) return 2;
  if (range < 60) return 10;
  if (range < 150) return 20;
  return 50;
}
