import { projectAircraftPosition } from "../aircraft/space-position.mjs";
import { predictAircraftPosition } from "../predict-aircraft-position.mjs";
import { formatAircraftTag } from "../aircraft/tag-data.mjs";
import { getAircraftEmergencyLabel } from "../../shared/aircraft/emergency.mjs";
import { isAircraftDisplayNearHome } from "./aircraft-display/near-home.mjs";
import { projectAircraftHistory } from "./aircraft-display/history.mjs";

export function projectAircraftDisplayItems(aircraft, trails, location, elevationFeet, project) {
  const display = [];
  for (const item of aircraft.values()) {
    const position = projectAircraftPosition(item, location, elevationFeet);
    if (!position) continue;
    const marker = project(position);
    if (!Number.isFinite(marker?.x) || !Number.isFinite(marker?.y)) continue;
    const future = predictAircraftPosition(position, item);
    const futureMarker = future ? project(future) : null;
    const emergencyTag = getAircraftEmergencyLabel(item);
    display.push({
      ...marker,
      receivedAt: item.receivedAt,
      remoteOnly: item.remoteOnly === true,
      nearHomePass: isAircraftDisplayNearHome(item, location, elevationFeet),
      emergencyTag,
      emergency: Boolean(emergencyTag),
      futureX: Number.isFinite(futureMarker?.x) ? futureMarker.x : null,
      futureY: Number.isFinite(futureMarker?.y) ? futureMarker.y : null,
      lines: formatAircraftTag(item),
      history: projectAircraftHistory(trails, item.icao, project),
    });
  }
  return display;
}
