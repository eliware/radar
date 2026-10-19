import { projectAircraftPosition } from "./aircraft/space-position.mjs";
import { selectDefaultRadarRange } from "./radar/range.mjs";

export function createAircraftSceneUpdater({
  location,
  elevationFeet,
  targets,
  trails,
  radarCamera,
  isAutoZoom,
  defaultRangeNm,
}) {
  function update(aircraft, autoZoom = true) {
    const position = projectAircraftPosition(aircraft, location, elevationFeet);
    if (!position) return;
    const expired = targets.update(aircraft, Math.hypot(position.x, position.z));
    trails.remove(expired);
    trails.add(aircraft.icao, position);
    if (!autoZoom || !isAutoZoom()) return;
    const nextRange = selectDefaultRadarRange(targets.localDistances(), defaultRangeNm);
    if (nextRange !== radarCamera.range()) radarCamera.setRange(nextRange);
  }
  update.updateRemote = (items) => {
    const remote = items.filter((item) => item.remoteOnly);
    trails.remove(targets.removeRemoteOnlyExcept(remote.map((item) => item.icao)));
    remote.forEach((item) => update(item, false));
  };
  update.updateSnapshot = (items, localFurthestDistanceNm) => {
    const aircraft = Array.isArray(items) ? items : [];
    trails.remove(targets.retain(aircraft.map((item) => item.icao)));
    aircraft.forEach((item) => update(item, false));
    if (isAutoZoom() && Number.isFinite(localFurthestDistanceNm)) {
      const nextRange = selectDefaultRadarRange([localFurthestDistanceNm], defaultRangeNm);
      if (nextRange !== radarCamera.range()) radarCamera.setRange(nextRange);
    }
  };
  return update;
}
