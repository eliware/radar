import { drawAirportMarkers } from "../airport/markers.mjs";
import { drawAirspaceRings } from "../airspace-rings.mjs";
import { drawAirportRunways } from "../airport/runways.mjs";
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
  if (referenceVisibility.airportsVisible && airspaceRingsVisible)
    drawAirspaceRings(context, airports, project);
  drawAirportRunways(
    context,
    airports,
    project,
    referenceVisibility.airportsVisible && runwayVisibility.runwaysVisible,
    referenceVisibility.airportsVisible && runwayVisibility.extensionsVisible,
    referenceVisibility.airportsVisible && runwayVisibility.baseLegsVisible,
  );
  if (referenceVisibility.airportsVisible) drawAirportMarkers(context, airports, project);
  if (referenceVisibility.navaidsVisible)
    drawNavaidMarkers(context, references.navaids ?? new Map(), project);
  drawArtccBoundaries(context, references.boundaries ?? new Map(), project);
  drawIlsApproaches(context, references.ilsApproaches ?? new Map(), project, ilsVisible);
  drawProcedures(context, references.procedures ?? new Map(), project, procedures);
  drawAirways(context, references.airways ?? new Map(), project, airwayVisibility);
}
