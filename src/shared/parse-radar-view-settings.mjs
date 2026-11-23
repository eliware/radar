import { default as parseRadarRangeSetting } from "./radar-view-settings.mjs";
import { default as parseRadarRotationSetting } from "./radar-view/rotation.mjs";

function parseRadarViewSettings(environment) {
  return {
    defaultRangeNm: parseRadarRangeSetting(environment.RADAR_DEFAULT_RANGE_NM),
    defaultRotationDegrees: parseRadarRotationSetting(environment.RADAR_DEFAULT_ROTATION),
  };
}
export default parseRadarViewSettings;
