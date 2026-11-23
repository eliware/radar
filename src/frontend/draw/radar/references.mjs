import { default as drawAirportLayer } from "./airport-layer.mjs";
import { default as drawNavaidMarkers } from "../navaid-markers.mjs";
import { default as drawArtccBoundaries } from "../artcc-boundaries.mjs";
import { default as drawIlsApproaches } from "../ils-approaches.mjs";
import { default as drawProcedures } from "../procedures.mjs";
import { default as drawAirways } from "../airways.mjs";
import { default as normalizeProcedureVisibility } from "./procedure-visibility.mjs";
import { default as radarReferenceData } from "./reference-data.mjs";

function drawRadarReferences(
  context,
  references,
  project,
  ilsVisible = true,
  procedureVisibility = { sidVisible: true, starVisible: true },
  airwayVisibility = { Q: true, J: true, V: true },
  runwayVisibility = { runwaysVisible: true, extensionsVisible: true, baseLegsVisible: true },
  referenceVisibility = { airportsVisible: true, navaidsVisible: true },
  airspaceRingsVisible = true,
) {
  const {
    airports,
    navaids,
    boundaries,
    ilsApproaches,
    procedures: referenceProcedures,
    airways,
  } = radarReferenceData(references);
  const procedures = normalizeProcedureVisibility(procedureVisibility);
  drawAirportLayer(
    context,
    airports,
    project,
    runwayVisibility,
    referenceVisibility,
    airspaceRingsVisible,
  );
  if (referenceVisibility.navaidsVisible) drawNavaidMarkers(context, navaids, project);
  drawArtccBoundaries(context, boundaries, project);
  drawIlsApproaches(context, ilsApproaches, project, ilsVisible);
  drawProcedures(context, referenceProcedures, project, procedures);
  drawAirways(context, airways, project, airwayVisibility);
}
export default drawRadarReferences;
