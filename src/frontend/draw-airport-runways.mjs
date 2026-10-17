import { runwayDestination } from "./runway-destination.mjs";

const EXTENSION_NM = 10;
const EXTENSION_ALTITUDE_FEET = 3000;

export function drawAirportRunways(
  context,
  airports,
  project,
  range,
  runwaysVisible = true,
  extensionsVisible = true,
) {
  context.strokeStyle = "#777777";
  context.lineWidth = 1.5;
  context.setLineDash([]);
  for (const airport of airports.values()) {
    if (airport.rangeNm > range) continue;
    for (const runway of airport.runways ?? [])
      drawRunway(context, runway, airport, project, runwaysVisible, extensionsVisible);
  }
}

function drawRunway(context, runway, airport, project, runwaysVisible, extensionsVisible) {
  const ends = runway.map((end) => ({
    ...end,
    elevationFeet: Number.isFinite(end.elevationFeet) ? end.elevationFeet : airport.elevationFeet,
  }));
  const points = ends.map(project);
  if (points.some((point) => !validPoint(point))) return;
  if (runwaysVisible) drawLine(context, points[0], points[1]);
  if (extensionsVisible) for (const end of ends) drawRunwayExtension(context, end, project);
}

function drawRunwayExtension(context, end, project) {
  const outward = (end.alignmentDegrees + 180) % 360;
  const farEnd = runwayDestination(end, outward, EXTENSION_NM);
  const baseElevation = Number.isFinite(end.elevationFeet) ? end.elevationFeet : 0;
  const farAltitude = baseElevation + EXTENSION_ALTITUDE_FEET;
  const outerPoint = project({ ...farEnd, elevationFeet: farAltitude });
  const left = project({
    ...runwayDestination(farEnd, outward - 90, 5),
    elevationFeet: farAltitude,
  });
  const right = project({
    ...runwayDestination(farEnd, outward + 90, 5),
    elevationFeet: farAltitude,
  });
  const origin = project({ ...end, elevationFeet: baseElevation });
  if (![origin, outerPoint, left, right].every(validPoint)) return;
  context.strokeStyle = "#333333";
  context.lineCap = "round";
  context.setLineDash([1, 5]);
  drawLine(context, origin, outerPoint);
  drawLine(context, left, right);
  context.setLineDash([]);
}

function drawLine(context, first, second) {
  context.beginPath();
  context.moveTo(first.x, first.y);
  context.lineTo(second.x, second.y);
  context.stroke();
}

function validPoint(point) {
  return Number.isFinite(point?.x) && Number.isFinite(point?.y);
}
