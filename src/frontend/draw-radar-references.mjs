import { drawAirportMarkers } from "./draw-airport-markers.mjs";
import { drawNavaidMarkers } from "./draw-navaid-markers.mjs";
import { drawArtccBoundaries } from "./draw-artcc-boundaries.mjs";
import { drawIlsApproaches } from "./draw-ils-approaches.mjs";

export function drawRadarReferences(context, references, project, range, ilsVisible = true) {
  drawAirportMarkers(context, references.airports ?? new Map(), project, range);
  drawNavaidMarkers(context, references.navaids ?? new Map(), project, range);
  drawArtccBoundaries(context, references.boundaries ?? new Map(), project);
  drawIlsApproaches(context, references.ilsApproaches ?? new Map(), project, range, ilsVisible);
}
