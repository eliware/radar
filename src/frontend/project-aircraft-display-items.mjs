import { projectAircraftPosition } from "./aircraft-space-position.mjs";
import { predictAircraftPosition } from "./predict-aircraft-position.mjs";
import { formatAircraftTag } from "./aircraft-tag-data.mjs";
import { isAircraftProjectedNearHome } from "./aircraft-near-home-pass.mjs";
import { getAircraftEmergencyLabel } from "../shared/aircraft-emergency.mjs";

export function projectAircraftDisplayItems(aircraft, trails, location, elevationFeet, project) {
  const display = [];
  for (const item of aircraft.values()) {
    const position = projectAircraftPosition(item, location, elevationFeet);
    if (!position) continue;
    const marker = project(position);
    const future = predictAircraftPosition(position, item);
    display.push({
      ...marker,
      receivedAt: item.receivedAt,
      nearHomePass: isAircraftProjectedNearHome(item, location, elevationFeet),
      emergency: Boolean(getAircraftEmergencyLabel(item)),
      futureX: future ? project(future).x : null,
      futureY: future ? project(future).y : null,
      lines: formatAircraftTag(item),
      history: (trails.get(item.icao) ?? []).map(project),
    });
  }
  return display;
}
