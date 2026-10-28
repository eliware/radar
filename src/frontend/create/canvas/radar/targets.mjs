import { updateAircraftTargetAndTrail } from "../../../aircraft/target-updates.mjs";

export function updateCanvasRadarTarget(item, location, targets, trails) {
  return updateAircraftTargetAndTrail({ aircraft: item, location, targets, trails });
}

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

export function listCanvasRadarTargets(targets, trails) {
  return trails.withReceivedAt(targets.items());
}
