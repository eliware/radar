import { drawRadarReferences } from "../radar/references.mjs";
import { projectRadarReference } from "../../project/radar-reference.mjs";
import { drawWaterOutlines } from "../water/outlines.mjs";

export function drawCanvasRadarWater(ctx, visible, paths, project, location, width, height) {
  if (visible) drawWaterOutlines(ctx, paths, project, location, width, height);
}

export function drawCanvasRadarReferences(options) {
  const {
    ctx,
    location,
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
    ilsVisible,
    procedureVisibility,
    airwayVisibility,
    runwayVisibility,
    referenceVisibility,
  );
}
