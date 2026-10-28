import { updateAircraftTargetAndTrail } from "./aircraft/target-updates.mjs";
import { selectDefaultRadarRange } from "./radar/default-range.mjs";

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
    const update = updateAircraftTargetAndTrail({
      aircraft,
      location,
      elevationFeet,
      targets,
      trails,
    });
    if (!update) return;
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
  update.items = () => trails.withReceivedAt(targets.items());
  return update;
}
