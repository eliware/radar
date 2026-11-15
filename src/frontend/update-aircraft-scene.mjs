import { updateAircraftTargetAndTrail } from "./aircraft/target/updates.mjs";
import { selectDefaultRadarRange } from "./radar/default-range.mjs";

export function createAircraftSceneUpdater({
  location,
  elevationFeet,
  targets,
  trails,
  receiveTimes,
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
      receiveTimes,
    });
    if (!update) return;
    if (!autoZoom || !isAutoZoom()) return;
    const nextRange = selectDefaultRadarRange(targets.localDistances(), defaultRangeNm);
    if (nextRange !== radarCamera.range()) radarCamera.setRange(nextRange);
  }
  update.updateRemote = (items) => {
    const remote = items.filter((item) => item.remoteOnly);
    const removed = targets.removeRemoteOnlyExcept(remote.map((item) => item.icao));
    trails.remove(removed);
    receiveTimes?.remove(removed);
    remote.forEach((item) => update(item, false));
  };
  update.updateSnapshot = (items, localFurthestDistanceNm) => {
    const aircraft = Array.isArray(items) ? items : [];
    const removed = targets.retain(aircraft.map((item) => item.icao));
    trails.remove(removed);
    receiveTimes?.remove(removed);
    aircraft.forEach((item) => update(item, false));
    if (isAutoZoom() && Number.isFinite(localFurthestDistanceNm)) {
      const nextRange = selectDefaultRadarRange([localFurthestDistanceNm], defaultRangeNm);
      if (nextRange !== radarCamera.range()) radarCamera.setRange(nextRange);
    }
  };
  update.items = () => receiveTimes?.withReceivedAt(targets.items()) ?? targets.items();
  return update;
}
