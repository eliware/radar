import { clampRadarRange, RADAR_SCOPE_RADIUS_RATIO } from "./radar-range.mjs";

const RADAR_FIELD_OF_VIEW_DEGREES = 48;

export function rangeToCameraDistance(range) {
  const halfAngle = (RADAR_FIELD_OF_VIEW_DEGREES * Math.PI) / 360;
  return clampRadarRange(range) / (2 * RADAR_SCOPE_RADIUS_RATIO * Math.tan(halfAngle));
}

export function cameraDistanceToRange(distance) {
  const halfAngle = (RADAR_FIELD_OF_VIEW_DEGREES * Math.PI) / 360;
  return clampRadarRange(distance * 2 * RADAR_SCOPE_RADIUS_RATIO * Math.tan(halfAngle));
}
