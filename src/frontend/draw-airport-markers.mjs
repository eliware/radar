import { drawAirspaceRings } from "./draw-airspace-rings.mjs";

const AIRPORT_COLOR = "#b8b8b8";

export function drawAirportMarkers(context, airports, project, range) {
  context.save();
  drawAirspaceRings(context, airports, project, range);
  drawRunways(context, airports, project, range);
  context.fillStyle = AIRPORT_COLOR;
  context.strokeStyle = AIRPORT_COLOR;
  context.font = "12px monospace";
  context.textAlign = "center";
  for (const airport of airports.values()) {
    if (airport.rangeNm > range) continue;
    const point = project(airport);
    if (!Number.isFinite(point?.x) || !Number.isFinite(point?.y)) continue;
    context.beginPath();
    context.arc(point.x, point.y, 2.5, 0, Math.PI * 2);
    context.fill();
    context.fillText(airport.icao || airport.faaId, point.x, point.y - 10);
  }
  context.restore();
}

function drawRunways(context, airports, project, range) {
  context.strokeStyle = "#777777";
  context.lineWidth = 1.5;
  context.setLineDash([]);
  for (const airport of airports.values()) {
    if (airport.rangeNm > range) continue;
    for (const runway of airport.runways ?? []) {
      const ends = runway.map((end) => ({ ...end, elevationFeet: airport.elevationFeet }));
      const points = ends.map(project);
      if (points.some((point) => !validPoint(point))) continue;
      drawLine(context, points[0], points[1]);
      for (const end of ends) drawRunwayExtension(context, end, project);
    }
  }
}

function drawRunwayExtension(context, end, project) {
  const outward = (end.alignmentDegrees + 180) % 360;
  const farEnd = destination(end, outward, 10);
  const outerPoint = project({ ...farEnd, elevationFeet: end.elevationFeet });
  const left = project({
    ...destination(farEnd, outward - 90, 5),
    elevationFeet: end.elevationFeet,
  });
  const right = project({
    ...destination(farEnd, outward + 90, 5),
    elevationFeet: end.elevationFeet,
  });
  const origin = project(end);
  if (![origin, outerPoint, left, right].every(validPoint)) return;
  context.strokeStyle = "#333333";
  context.lineCap = "round";
  context.setLineDash([1, 5]);
  drawLine(context, origin, outerPoint);
  context.setLineDash([1, 5]);
  drawLine(context, left, right);
  context.setLineDash([]);
}

function destination(point, bearingDegrees, rangeNm) {
  const angularDistance = rangeNm / 3440.065;
  const bearing = (bearingDegrees * Math.PI) / 180;
  const latitude = (point.latitude * Math.PI) / 180;
  const longitude = (point.longitude * Math.PI) / 180;
  const nextLatitude = Math.asin(
    Math.sin(latitude) * Math.cos(angularDistance) +
      Math.cos(latitude) * Math.sin(angularDistance) * Math.cos(bearing),
  );
  const nextLongitude =
    longitude +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latitude),
      Math.cos(angularDistance) - Math.sin(latitude) * Math.sin(nextLatitude),
    );
  return { latitude: (nextLatitude * 180) / Math.PI, longitude: (nextLongitude * 180) / Math.PI };
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
