import { getAircraftAgeBrightness } from "../../aircraft/age-brightness.mjs";
import { getAircraftEmergencyLabel } from "../../../shared/aircraft/emergency.mjs";

const MIN_FLIGHT_STRIP_OPACITY = 0.25;

export function getFlightStripStatus(item, now = Date.now()) {
  const remoteOnly = Boolean(item.remoteOnly);
  const emergency = Boolean(getAircraftEmergencyLabel(item));
  const nearHomePass = Boolean(item.nearHomePass && !remoteOnly && !emergency);
  const classes = [
    remoteOnly && "remote-only",
    emergency && "emergency",
    nearHomePass && "near-home-pass",
    nearHomePass && (Math.floor(now / 500) % 2 ? "flash-white" : "flash-green"),
  ].filter(Boolean);
  return {
    opacity: Math.max(MIN_FLIGHT_STRIP_OPACITY, getAircraftAgeBrightness(item.lastSeen, now)),
    classNames: classes.join(" "),
  };
}
