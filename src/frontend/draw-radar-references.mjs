import { drawAirportMarkers } from "./draw-airport-markers.mjs";
import { drawAirspaceRings } from "./draw-airspace-rings.mjs";
import { drawAirportRunways } from "./draw-airport-runways.mjs";
import { drawNavaidMarkers } from "./draw-navaid-markers.mjs";
import { drawArtccBoundaries } from "./draw-artcc-boundaries.mjs";
import { drawIlsApproaches } from "./draw-ils-approaches.mjs";
import { drawProcedures } from "./draw-procedures.mjs";
import { drawAirways } from "./draw-airways.mjs";

export function drawRadarReferences(
  context,
  references,
  project,
  range,
  ilsVisible = true,
  procedureVisibility = { sidVisible: true, starVisible: true },
  scope = null,
  airwayVisibility = { Q: true, J: true, V: true },
  runwayVisibility = { runwaysVisible: true, extensionsVisible: true },
  referenceVisibility = { airportsVisible: true, navaidsVisible: true },
  airspaceRingsVisible = true,
) {
  const airports = references.airports ?? new Map();
  const procedures =
    typeof procedureVisibility === "boolean"
      ? { sidVisible: procedureVisibility, starVisible: procedureVisibility }
      : procedureVisibility;
  if (referenceVisibility.airportsVisible && airspaceRingsVisible)
    drawAirspaceRings(context, airports, project, range);
  drawAirportRunways(
    context,
    airports,
    project,
    range,
    referenceVisibility.airportsVisible && runwayVisibility.runwaysVisible,
    referenceVisibility.airportsVisible && runwayVisibility.extensionsVisible,
  );
  if (referenceVisibility.airportsVisible) drawAirportMarkers(context, airports, project, range);
  if (referenceVisibility.navaidsVisible)
    drawNavaidMarkers(context, references.navaids ?? new Map(), project, range);
  drawArtccBoundaries(context, references.boundaries ?? new Map(), project);
  drawIlsApproaches(context, references.ilsApproaches ?? new Map(), project, range, ilsVisible);
  drawProcedures(context, references.procedures ?? new Map(), project, range, procedures, scope);
  drawAirways(context, references.airways ?? new Map(), project, range, airwayVisibility, scope);
}
