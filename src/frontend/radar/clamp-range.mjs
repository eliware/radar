import { DEFAULT_RADAR_RANGE, MAX_RADAR_RANGE, MIN_RADAR_RANGE } from "./range.mjs";

function clampRadarRange(range) {
  if (!Number.isFinite(range)) return DEFAULT_RADAR_RANGE;
  return Math.min(MAX_RADAR_RANGE, Math.max(MIN_RADAR_RANGE, range));
}
export default clampRadarRange;
