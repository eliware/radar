import { drawAirportMarkers } from "../airport/markers.mjs";
import { drawAirspaceRings } from "../airspace-rings.mjs";
import { drawAirportRunways } from "../airport/runways.mjs";
import { drawNavaidMarkers } from "../navaid-markers.mjs";
import { drawArtccBoundaries } from "../artcc-boundaries.mjs";
import { drawIlsApproaches } from "../ils-approaches.mjs";
import { drawProcedures } from "../procedures.mjs";
import { drawAirways } from "../airways.mjs";
import { MAX_RADAR_RANGE } from "../../radar/range.mjs";

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
    referenceVisibility.airportsVisible && runwayVisibility.baseLegsVisible,
  );
  if (referenceVisibility.airportsVisible) drawAirportMarkers(context, airports, project, maxRange);
  if (referenceVisibility.navaidsVisible)
    drawNavaidMarkers(context, references.navaids ?? new Map(), project, maxRange);
  drawArtccBoundaries(context, references.boundaries ?? new Map(), project);
  drawIlsApproaches(context, references.ilsApproaches ?? new Map(), project, maxRange, ilsVisible);
  drawProcedures(context, references.procedures ?? new Map(), project, maxRange, procedures);
  drawAirways(context, references.airways ?? new Map(), project, maxRange, airwayVisibility);
}
