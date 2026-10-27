import { MAX_RADAR_RANGE } from "../../radar/range.mjs";
import { createRunwayGuidePoints } from "./runway-guides.mjs";

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
  if (runwaysVisible) drawLine(context, points[0], points[1]);
  if (extensionsVisible || baseLegsVisible)
    for (const end of ends)
      drawRunwayExtension(context, end, project, extensionsVisible, baseLegsVisible);
}

function drawRunwayExtension(context, end, project, extensionsVisible, baseLegsVisible) {
  const guide = createRunwayGuidePoints(end);
  const outerPoint = extensionsVisible ? project(guide.extensionEnd) : null;
  const origin = extensionsVisible ? project(guide.extensionStart) : null;
  const [left, right] = baseLegsVisible ? guide.baseLegs.map(project) : [null, null];
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
