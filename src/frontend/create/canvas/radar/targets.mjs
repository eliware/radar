import { default as updateAircraftTargetAndTrail } from "../../../aircraft/target/updates.mjs";

function updateCanvasRadarTarget(item, location, targets, trails, receiveTimes) {
  return updateAircraftTargetAndTrail({ aircraft: item, location, targets, trails, receiveTimes });
}
export default updateCanvasRadarTarget;
