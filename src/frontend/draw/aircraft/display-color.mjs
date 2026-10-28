import { getAircraftEmergencyLabel } from "../../../shared/aircraft/emergency.mjs";

const EMERGENCY_COLOR = "#ff0000";
const REMOTE_ONLY_COLOR = "#ffbf00";

export function displayColor(item, normalColor, now) {
  if (getAircraftEmergencyLabel(item)) return EMERGENCY_COLOR;
  if (item.remoteOnly) return REMOTE_ONLY_COLOR;
  if (!item.nearHomePass) return normalColor;
  return Math.floor(now / 500) % 2 === 0 ? "#00ff41" : "#ffffff";
}
