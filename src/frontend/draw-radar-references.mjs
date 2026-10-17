import { drawAirportMarkers } from "./draw-airport-markers.mjs";
import { drawAirspaceRings } from "./draw-airspace-rings.mjs";
import { drawAirportRunways } from "./draw-airport-runways.mjs";
import { drawNavaidMarkers } from "./draw-navaid-markers.mjs";
import { drawArtccBoundaries } from "./draw-artcc-boundaries.mjs";
import { drawIlsApproaches } from "./draw-ils-approaches.mjs";
import { drawProcedures } from "./draw-procedures.mjs";
import { drawAirways } from "./draw-airways.mjs";
import { MAX_RADAR_RANGE } from "./radar-range.mjs";

export function drawRadarReferences(
  context,
  references,
  project,
  ilsVisible = true,
  procedureVisibility = { sidVisible: true, starVisible: true },
  airwayVisibility = { Q: true, J: true, V: true },
  runwayVisibility = { runwaysVisible: true, extensionsVisible: true },
  referenceVisibility = { airportsVisible: true, navaidsVisible: true },
  airspaceRingsVisible = true,
) {
  const maxRange = MAX_RADAR_RANGE;
  const airports = references.airports ?? new Map();
  const procedures =
    typeof procedureVisibility === "boolean"
      ? { sidVisible: procedureVisibility, starVisible: procedureVisibility }
      : procedureVisibility;
  if (referenceVisibility.airportsVisible && airspaceRingsVisible)
    drawAirspaceRings(context, airports, project, maxRange);
  drawAirportRunways(
    context,
    airports,
    project,
    maxRange,
    referenceVisibility.airportsVisible && runwayVisibility.runwaysVisible,
    referenceVisibility.airportsVisible && runwayVisibility.extensionsVisible,
  );
  if (referenceVisibility.airportsVisible) drawAirportMarkers(context, airports, project, maxRange);
  if (referenceVisibility.navaidsVisible)
    drawNavaidMarkers(context, references.navaids ?? new Map(), project, maxRange);
  drawArtccBoundaries(context, references.boundaries ?? new Map(), project);
  drawIlsApproaches(context, references.ilsApproaches ?? new Map(), project, maxRange, ilsVisible);
  drawProcedures(context, references.procedures ?? new Map(), project, maxRange, procedures);
  drawAirways(context, references.airways ?? new Map(), project, maxRange, airwayVisibility);
}
