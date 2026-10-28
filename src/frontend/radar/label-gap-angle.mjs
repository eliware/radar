export function getRadarLabelGapAngle(radius, labelWidth, padding = 4) {
  const halfWidth = (labelWidth / 2 + padding) / radius;
  return 2 * Math.asin(Math.min(0.999, Math.max(0, halfWidth)));
}
