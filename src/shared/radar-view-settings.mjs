import { DEFAULT_RADAR_RANGE_NM, parseRadarRangeSetting } from "./radar-view/range.mjs";
import {
  DEFAULT_RADAR_ROTATION_DEGREES,
  parseRadarRotationSetting,
} from "./radar-view/rotation.mjs";

export { DEFAULT_RADAR_RANGE_NM, DEFAULT_RADAR_ROTATION_DEGREES };

export function parseRadarViewSettings(environment) {
  return {
    defaultRangeNm: parseRadarRangeSetting(environment.RADAR_DEFAULT_RANGE_NM),
    defaultRotationDegrees: parseRadarRotationSetting(environment.RADAR_DEFAULT_ROTATION),
  };
}
