import { clampRadarRange } from "./clamp-range.mjs";
import { RADAR_SCOPE_RADIUS_RATIO } from "./range.mjs";

const HALF_FIELD_OF_VIEW_RADIANS = (48 * Math.PI) / 360;

export function cameraDistanceToRange(distance) {
  return clampRadarRange(
    distance * 2 * RADAR_SCOPE_RADIUS_RATIO * Math.tan(HALF_FIELD_OF_VIEW_RADIANS),
  );
}
