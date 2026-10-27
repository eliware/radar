import { drawAirportLayer } from "./airport-layer.mjs";
import { drawNavaidMarkers } from "../navaid-markers.mjs";
import { drawArtccBoundaries } from "../artcc-boundaries.mjs";
import { drawIlsApproaches } from "../ils-approaches.mjs";
import { drawProcedures } from "../procedures.mjs";
import { drawAirways } from "../airways.mjs";

export function drawRadarReferences(
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
  const airports = references.airports ?? new Map();
  const procedures =
    typeof procedureVisibility === "boolean"
      ? { sidVisible: procedureVisibility, starVisible: procedureVisibility }
      : procedureVisibility;
  drawAirportLayer(
    context,
    airports,
    project,
    runwayVisibility,
    referenceVisibility,
    airspaceRingsVisible,
  );
  if (referenceVisibility.navaidsVisible)
    drawNavaidMarkers(context, references.navaids ?? new Map(), project);
  drawArtccBoundaries(context, references.boundaries ?? new Map(), project);
  drawIlsApproaches(context, references.ilsApproaches ?? new Map(), project, ilsVisible);
  drawProcedures(context, references.procedures ?? new Map(), project, procedures);
  drawAirways(context, references.airways ?? new Map(), project, airwayVisibility);
}
