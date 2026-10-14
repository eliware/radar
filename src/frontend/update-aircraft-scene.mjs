import { projectAircraftPosition } from "./aircraft-space-position.mjs";
import { selectDefaultRadarRange } from "./radar-range.mjs";

export function createAircraftSceneUpdater({
  location,
  elevationFeet,
  targets,
  trails,
  radarCamera,
  isAutoZoom,
  defaultRangeNm,
}) {
  return (aircraft) => {
    const position = projectAircraftPosition(aircraft, location, elevationFeet);
    if (!position) return;
    const expired = targets.update(aircraft, Math.hypot(position.x, position.z));
    trails.remove(expired);
    trails.add(aircraft.icao, position);
    if (!isAutoZoom()) return;
    const nextRange = selectDefaultRadarRange(targets.distances(), defaultRangeNm);
    if (nextRange !== radarCamera.range()) radarCamera.setRange(nextRange);
  };
}
