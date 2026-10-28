import { clampRadarRange } from "./clamp-range.mjs";
import { DEFAULT_RADAR_RANGE, RADAR_RANGE_MARGIN } from "./range.mjs";

export function selectDefaultRadarRange(targetDistances, defaultRange = DEFAULT_RADAR_RANGE) {
  const furthest = Math.max(0, ...targetDistances.filter(Number.isFinite));
  return clampRadarRange(Math.max(defaultRange, furthest + RADAR_RANGE_MARGIN));
}
