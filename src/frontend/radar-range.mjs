export const MIN_RADAR_RANGE = 1;
export const MAX_RADAR_RANGE = 300;
export const DEFAULT_RADAR_RANGE = 20;
export const RADAR_RANGE_MARGIN = 5;
export const RADAR_FIELD_OF_VIEW_DEGREES = 48;
export const RADAR_SCOPE_RADIUS_RATIO = 0.44;
export const RADAR_TARGET_STALE_MS = 120_000;

export function clampRadarRange(range) {
  return Math.min(MAX_RADAR_RANGE, Math.max(MIN_RADAR_RANGE, range));
}

export function selectDefaultRadarRange(targetDistances) {
  const furthest = Math.max(0, ...targetDistances.filter(Number.isFinite));
  return clampRadarRange(Math.max(DEFAULT_RADAR_RANGE, furthest + RADAR_RANGE_MARGIN));
}

export function getRadarRingRanges(range) {
  const step = getRadarRingSpacing(range) / 2;
  const count = Math.floor(range / step);
  return Array.from({ length: count }, (_, index) => (index + 1) * step);
}

export function getRadarRingSpacing(range) {
  if (range < 10) return 2;
  if (range < 60) return 10;
  if (range < 150) return 20;
  return 50;
}

export function getRadarLabelGapAngle(radius, labelWidth, padding = 4) {
  const halfWidth = (labelWidth / 2 + padding) / radius;
  return 2 * Math.asin(Math.min(0.999, Math.max(0, halfWidth)));
}

export function rangeToCameraDistance(range) {
  const halfAngle = (RADAR_FIELD_OF_VIEW_DEGREES * Math.PI) / 360;
  return clampRadarRange(range) / (2 * RADAR_SCOPE_RADIUS_RATIO * Math.tan(halfAngle));
}

export function cameraDistanceToRange(distance) {
  const halfAngle = (RADAR_FIELD_OF_VIEW_DEGREES * Math.PI) / 360;
  return clampRadarRange(distance * 2 * RADAR_SCOPE_RADIUS_RATIO * Math.tan(halfAngle));
}
