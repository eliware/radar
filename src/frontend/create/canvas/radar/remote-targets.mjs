import { default as updateAircraftTargetAndTrail } from "../../../aircraft/target/updates.mjs";

function updateCanvasRadarRemoteTargets(items, location, targets, trails, receiveTimes) {
  const remote = items.filter((item) => item.remoteOnly);
  const removed = targets.removeRemoteOnlyExcept(remote.map((item) => item.icao));
  trails.remove(removed);
  receiveTimes?.remove(removed);
  for (const item of remote) {
    updateAircraftTargetAndTrail({
      aircraft: item,
      location,
      targets,
      trails,
      receiveTimes,
      addTrail: false,
      removeExpiredTrails: false,
    });
  }
}
export default updateCanvasRadarRemoteTargets;
