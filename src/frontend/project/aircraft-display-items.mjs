import { projectAircraftPosition } from "../aircraft/space-position.mjs";
import { predictAircraftPosition } from "../predict-aircraft-position.mjs";
import { formatAircraftTag } from "../aircraft/tag-data.mjs";
import { isAircraftProjectedNearHome } from "../aircraft/near-home/pass.mjs";
import { getAircraftEmergencyLabel } from "../../shared/aircraft/emergency.mjs";

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
      nearHomePass: isAircraftProjectedNearHome(item, location, elevationFeet),
      emergencyTag,
      emergency: Boolean(emergencyTag),
      futureX: Number.isFinite(futureMarker?.x) ? futureMarker.x : null,
      futureY: Number.isFinite(futureMarker?.y) ? futureMarker.y : null,
      lines: formatAircraftTag(item),
      history: (trails.get(item.icao) ?? []).map(project).filter(isVisible),
    });
  }
  return display;
}

function isVisible(point) {
  return Number.isFinite(point?.x) && Number.isFinite(point?.y);
}
