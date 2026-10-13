const APPROACH_LENGTH_NM = 10;
const FEET_PER_NM = 6076.12;
const ILS_COLOR = "#50402e";

export function drawIlsApproaches(context, approaches, project, range, visible = true) {
  if (!visible) return;
  context.save();
  context.strokeStyle = ILS_COLOR;
  context.lineWidth = 1.25;
  context.setLineDash([4, 4]);
  for (const approach of approaches.values()) {
    if (approach.rangeNm > range) continue;
    const bearing = approachBearing(approach);
    if (bearing === null) continue;
    const origin = project({ ...approach, elevationFeet: safeElevation(approach) });
    const endpoint = project(approachEndpoint(approach, bearing));
    if (!validPoint(origin) || !validPoint(endpoint)) continue;
    context.beginPath();
    context.moveTo(endpoint.x, endpoint.y);
    context.lineTo(origin.x, origin.y);
    context.stroke();
    drawMarkers(context, approach.markers ?? [], project, range);
  }
  context.restore();
}

function drawMarkers(context, markers, project, range) {
  context.setLineDash([]);
  for (const marker of markers) {
    if (marker.rangeNm > range) continue;
    const point = project({ ...marker, elevationFeet: safeElevation(marker) });
    if (!validPoint(point)) continue;
    context.beginPath();
    context.arc(point.x, point.y, 3, 0, Math.PI * 2);
    context.stroke();
  }
  context.setLineDash([4, 4]);
}

function approachBearing(approach) {
  if (!Number.isFinite(approach.magneticCourse)) return null;
  const variation = Number.isFinite(approach.magneticVariation) ? approach.magneticVariation : 0;
  const eastCorrection = approach.magneticVariationHemisphere === "W" ? -variation : variation;
  return (approach.magneticCourse + eastCorrection + 180 + 360) % 360;
}

function approachEndpoint(approach, bearing) {
  const angle = Number.isFinite(approach.glideSlopeDegrees) ? approach.glideSlopeDegrees : 0;
  const rise = APPROACH_LENGTH_NM * FEET_PER_NM * Math.tan((angle * Math.PI) / 180);
  return {
    ...destination(approach, bearing, APPROACH_LENGTH_NM),
    elevationFeet: safeElevation(approach) + rise,
  };
}

function destination(point, bearingDegrees, rangeNm) {
  const angular = rangeNm / 3440.065;
  const bearing = (bearingDegrees * Math.PI) / 180;
  const latitude = (point.latitude * Math.PI) / 180;
  const longitude = (point.longitude * Math.PI) / 180;
  const nextLatitude = Math.asin(
    Math.sin(latitude) * Math.cos(angular) +
      Math.cos(latitude) * Math.sin(angular) * Math.cos(bearing),
  );
  const nextLongitude =
    longitude +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angular) * Math.cos(latitude),
      Math.cos(angular) - Math.sin(latitude) * Math.sin(nextLatitude),
    );
  return { latitude: (nextLatitude * 180) / Math.PI, longitude: (nextLongitude * 180) / Math.PI };
}

function safeElevation(approach) {
  return Number.isFinite(approach.elevationFeet) ? approach.elevationFeet : 0;
}

function validPoint(point) {
  return Number.isFinite(point?.x) && Number.isFinite(point?.y);
}
