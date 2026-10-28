import { updateAircraftTargetAndTrail } from "../../../aircraft/target-updates.mjs";

export function updateCanvasRadarTarget(item, location, targets, trails) {
  return updateAircraftTargetAndTrail({ aircraft: item, location, targets, trails });
}
