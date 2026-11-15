import { createRadarTargets } from "../../../radar/targets.mjs";
import { createAircraftTrails } from "../../../aircraft/trails.mjs";
import { createAircraftReceiveTimes } from "../../../aircraft/receive-times.mjs";
import { updateCanvasRadarAutoZoom } from "./auto-zoom.mjs";
import { updateCanvasRadarTarget } from "./targets.mjs";
import { updateCanvasRadarRemoteTargets } from "./remote-targets.mjs";
import { listCanvasRadarTargets } from "./list-targets.mjs";
import { reconcileCanvasRadarSnapshot } from "./snapshots.mjs";

export function createCanvasRadarAircraftState(location, state, draw) {
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
