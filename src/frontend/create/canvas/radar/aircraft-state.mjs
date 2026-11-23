import { default as createRadarTargets } from "../../../radar/targets.mjs";
import { default as createAircraftTrails } from "../../../aircraft/trails.mjs";
import { default as createAircraftReceiveTimes } from "../../../aircraft/receive-times.mjs";
import { default as updateCanvasRadarAutoZoom } from "./auto-zoom.mjs";
import { default as updateCanvasRadarTarget } from "./targets.mjs";
import { default as updateCanvasRadarRemoteTargets } from "./remote-targets.mjs";
import { default as listCanvasRadarTargets } from "./list-targets.mjs";
import { default as reconcileCanvasRadarSnapshot } from "./snapshots.mjs";

function createCanvasRadarAircraftState(location, state, draw) {
  const targets = createRadarTargets();
  const trails = createAircraftTrails();
  const receiveTimes = createAircraftReceiveTimes();
  return {
    targets,
    trails,
    receiveTimes,
    update(item, shouldDraw = true) {
      const update = updateCanvasRadarTarget(item, location, targets, trails, receiveTimes);
      if (!update) return;
      updateCanvasRadarAutoZoom(state, targets.localDistances());
      if (shouldDraw) draw();
    },
    updateSnapshot(items, localFurthestDistanceNm) {
      reconcileCanvasRadarSnapshot(items, targets, trails, receiveTimes, this.update);
      if (Number.isFinite(localFurthestDistanceNm))
        updateCanvasRadarAutoZoom(state, [localFurthestDistanceNm]);
      draw();
    },
    updateRemote(items) {
      updateCanvasRadarRemoteTargets(items, location, targets, trails, receiveTimes);
      draw();
    },
    items() {
      return listCanvasRadarTargets(targets, receiveTimes);
    },
  };
}
export default createCanvasRadarAircraftState;
