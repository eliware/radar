import { updateAircraftTargetAndTrail } from "../../../aircraft/target-updates.mjs";

export function updateCanvasRadarRemoteTargets(items, location, targets, trails) {
  const remote = items.filter((item) => item.remoteOnly);
  trails.remove(targets.removeRemoteOnlyExcept(remote.map((item) => item.icao)));
  for (const item of remote) {
    updateAircraftTargetAndTrail({
      aircraft: item,
      location,
      targets,
      trails,
      addTrail: false,
      removeExpiredTrails: false,
    });
  }
}
