import { projectAircraftPosition } from "./aircraft-space-position.mjs";
import { selectDefaultRadarRange } from "./radar-range.mjs";
import { createRadarTargets } from "./radar-targets.mjs";
import { createAircraftTrails } from "./aircraft-trails.mjs";

export function createCanvasRadarAircraftState(location, state, draw) {
  const targets = createRadarTargets();
  const trails = createAircraftTrails();
  return {
    targets,
    trails,
    update(item) {
      const position = projectAircraftPosition(item, location, 0);
      if (!position) return;
      const expired = targets.update(item, Math.hypot(position.x, position.z));
      trails.remove(expired);
      trails.add(item.icao, position);
      if (state.autoZoom) state.range = selectDefaultRadarRange(targets.distances());
      draw();
    },
  };
}
