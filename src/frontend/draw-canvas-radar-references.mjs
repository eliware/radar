import { drawRadarReferences } from "./draw-radar-references.mjs";
import { createRadarScopePath } from "./create-radar-scope-path.mjs";
import { projectRadarReference } from "./project-radar-reference.mjs";

export function drawCanvasRadarReferences(options) {
  const {
    ctx,
    location,
    range,
    radius,
    centerX,
    centerY,
    project,
    airports,
    navaids,
    boundaries,
    ilsApproaches,
    procedures,
    airways,
    ilsVisible,
    procedureVisibility,
    airwayVisibility,
    runwayVisibility,
    referenceVisibility,
  } = options;
  drawRadarReferences(
    ctx,
    { airports, navaids, boundaries, ilsApproaches, procedures, airways },
    (item) => projectRadarReference(item, location, 0, project),
    range,
    ilsVisible,
    procedureVisibility,
    createRadarScopePath(range, (point) => ({
      x: centerX + (point.x / range) * radius,
      y: centerY + (point.z / range) * radius,
    })),
    airwayVisibility,
    runwayVisibility,
    referenceVisibility,
  );
}
