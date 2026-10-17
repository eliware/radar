import { drawRadarReferences } from "../radar/references.mjs";
import { projectRadarReference } from "../../project/radar-reference.mjs";

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
