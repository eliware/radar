import { drawRunwayLine } from "../runway/line.mjs";

export function drawRunwaySegment(context, runway, airport, project, visible = true) {
  const ends = runway.map((end) => ({
    ...end,
    elevationFeet: Number.isFinite(end.elevationFeet) ? end.elevationFeet : airport.elevationFeet,
  }));
  const points = ends.map(project);
  if (points.some((point) => !validPoint(point))) return null;
  if (visible) drawRunwayLine(context, points[0], points[1]);
  return ends;
}

function validPoint(point) {
  return Number.isFinite(point?.x) && Number.isFinite(point?.y);
}
