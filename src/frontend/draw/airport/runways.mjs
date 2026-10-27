import { runwayDestination } from "../../runway-destination.mjs";

const EXTENSION_NM = 10;
const EXTENSION_ALTITUDE_FEET = 3000;

export function drawAirportRunways(
  context,
  airports,
  project,
  range,
  runwaysVisible = true,
  extensionsVisible = true,
  baseLegsVisible = true,
) {
  context.strokeStyle = "#777777";
  context.lineWidth = 1.5;
  context.setLineDash([]);
  for (const airport of airports.values()) {
    if (airport.rangeNm > range) continue;
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
  if (runwaysVisible) drawLine(context, points[0], points[1]);
  if (extensionsVisible || baseLegsVisible)
    for (const end of ends)
      drawRunwayExtension(context, end, project, extensionsVisible, baseLegsVisible);
}

function drawRunwayExtension(context, end, project, extensionsVisible, baseLegsVisible) {
  const outward = (end.alignmentDegrees + 180) % 360;
  const farEnd = runwayDestination(end, outward, EXTENSION_NM);
  const baseElevation = Number.isFinite(end.elevationFeet) ? end.elevationFeet : 0;
  const farAltitude = baseElevation + EXTENSION_ALTITUDE_FEET;
  const outerPoint = extensionsVisible ? project({ ...farEnd, elevationFeet: farAltitude }) : null;
  const origin = extensionsVisible ? project({ ...end, elevationFeet: baseElevation }) : null;
  const left = baseLegsVisible
    ? project({ ...runwayDestination(farEnd, outward - 90, 5), elevationFeet: farAltitude })
    : null;
  const right = baseLegsVisible
    ? project({ ...runwayDestination(farEnd, outward + 90, 5), elevationFeet: farAltitude })
    : null;
  const canDrawExtension = extensionsVisible && validPoint(origin) && validPoint(outerPoint);
  const canDrawBaseLegs = baseLegsVisible && validPoint(left) && validPoint(right);
  if (!canDrawExtension && !canDrawBaseLegs) return;
  context.strokeStyle = "#333333";
  context.lineCap = "round";
  context.setLineDash([1, 5]);
  if (canDrawExtension) drawLine(context, origin, outerPoint);
  if (canDrawBaseLegs) drawLine(context, left, right);
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
