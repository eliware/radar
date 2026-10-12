const EXTENSION_NM = 10;
const EXTENSION_ALTITUDE_FEET = 3000;

export function drawAirportRunways(context, airports, project, range) {
  context.strokeStyle = "#777777";
  context.lineWidth = 1.5;
  context.setLineDash([]);
  for (const airport of airports.values()) {
    if (airport.rangeNm > range) continue;
    for (const runway of airport.runways ?? []) drawRunway(context, runway, airport, project);
  }
}

function drawRunway(context, runway, airport, project) {
  const ends = runway.map((end) => ({
    ...end,
    elevationFeet: Number.isFinite(end.elevationFeet) ? end.elevationFeet : airport.elevationFeet,
  }));
  const points = ends.map(project);
  if (points.some((point) => !validPoint(point))) return;
  drawLine(context, points[0], points[1]);
  for (const end of ends) drawRunwayExtension(context, end, project);
}

function drawRunwayExtension(context, end, project) {
  const outward = (end.alignmentDegrees + 180) % 360;
  const farEnd = destination(end, outward, EXTENSION_NM);
  const baseElevation = Number.isFinite(end.elevationFeet) ? end.elevationFeet : 0;
  const farAltitude = baseElevation + EXTENSION_ALTITUDE_FEET;
  const outerPoint = project({ ...farEnd, elevationFeet: farAltitude });
  const left = project({ ...destination(farEnd, outward - 90, 5), elevationFeet: farAltitude });
  const right = project({ ...destination(farEnd, outward + 90, 5), elevationFeet: farAltitude });
  const origin = project({ ...end, elevationFeet: baseElevation });
  if (![origin, outerPoint, left, right].every(validPoint)) return;
  context.strokeStyle = "#333333";
  context.lineCap = "round";
  context.setLineDash([1, 5]);
  drawLine(context, origin, outerPoint);
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
