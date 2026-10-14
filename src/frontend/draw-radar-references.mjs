import { drawAirportMarkers } from "./draw-airport-markers.mjs";
import { drawAirspaceRings } from "./draw-airspace-rings.mjs";
import { drawAirportRunways } from "./draw-airport-runways.mjs";
import { drawNavaidMarkers } from "./draw-navaid-markers.mjs";
import { drawArtccBoundaries } from "./draw-artcc-boundaries.mjs";
import { drawIlsApproaches } from "./draw-ils-approaches.mjs";
import { drawProcedures } from "./draw-procedures.mjs";

export function drawRadarReferences(
  context,
  references,
  project,
  range,
  ilsVisible = true,
  proceduresVisible = true,
  scope = null,
) {
  const airports = references.airports ?? new Map();
  drawAirspaceRings(context, airports, project, range);
  drawAirportRunways(context, airports, project, range);
  drawAirportMarkers(context, airports, project, range);
  drawNavaidMarkers(context, references.navaids ?? new Map(), project, range);
  drawArtccBoundaries(context, references.boundaries ?? new Map(), project);
  drawIlsApproaches(context, references.ilsApproaches ?? new Map(), project, range, ilsVisible);
  drawProcedures(
    context,
    references.procedures ?? new Map(),
    project,
    range,
    proceduresVisible,
    scope,
  );
}
