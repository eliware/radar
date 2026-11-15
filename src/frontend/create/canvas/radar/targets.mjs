import { updateAircraftTargetAndTrail } from "../../../aircraft/target-updates.mjs";

export function updateCanvasRadarTarget(item, location, targets, trails, receiveTimes) {
  return updateAircraftTargetAndTrail({ aircraft: item, location, targets, trails, receiveTimes });
}
