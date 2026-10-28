import { parseRadarRangeSetting } from "./radar-view-settings.mjs";
import { parseRadarRotationSetting } from "./radar-view/rotation.mjs";

export function parseRadarViewSettings(environment) {
  return {
    defaultRangeNm: parseRadarRangeSetting(environment.RADAR_DEFAULT_RANGE_NM),
    defaultRotationDegrees: parseRadarRotationSetting(environment.RADAR_DEFAULT_ROTATION),
  };
}
