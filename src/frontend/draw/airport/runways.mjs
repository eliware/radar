import { MAX_RADAR_RANGE } from "../../radar/range.mjs";
import { drawRunwayGuides } from "./guides.mjs";
import { drawRunwayLine } from "./runway/line.mjs";

export function drawAirportRunways(
  context,
  airports,
  project,
  runwaysVisible = true,
  extensionsVisible = true,
  baseLegsVisible = true,
) {
  context.strokeStyle = "#777777";
  context.lineWidth = 1.5;
  context.setLineDash([]);
  for (const airport of airports.values()) {
    if (airport.rangeNm > MAX_RADAR_RANGE) continue;
    for (const runway of airport.runways ?? [])
      drawRunway(
        context,
        runway,
        airport,
        project,
        runwaysVisible,
        extensionsVisible,
        baseLegsVisible,
      );
  }
}

function drawRunway(
  context,
  runway,
  airport,
  project,
  runwaysVisible,
  extensionsVisible,
  baseLegsVisible,
) {
  const ends = runway.map((end) => ({
    ...end,
    elevationFeet: Number.isFinite(end.elevationFeet) ? end.elevationFeet : airport.elevationFeet,
  }));
  const points = ends.map(project);
  if (points.some((point) => !validPoint(point))) return;
  if (runwaysVisible) drawRunwayLine(context, points[0], points[1]);
  if (extensionsVisible || baseLegsVisible)
    for (const end of ends)
      drawRunwayGuides(context, end, project, extensionsVisible, baseLegsVisible);
}

function validPoint(point) {
  return Number.isFinite(point?.x) && Number.isFinite(point?.y);
}
