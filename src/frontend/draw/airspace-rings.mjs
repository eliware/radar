import { MAX_RADAR_RANGE } from "../radar/range.mjs";
import { airportAirspaceBands } from "../airport-airspace-bands.mjs";

const RING_COLOR = "#777777";

export function drawAirspaceRings(context, airports, project) {
  context.strokeStyle = RING_COLOR;
  context.lineWidth = 1;
  context.setLineDash([]);
  for (const airport of airports.values()) {
    if (airport.rangeNm > MAX_RADAR_RANGE) continue;
    const bands = airportAirspaceBands(airport);
    if (!bands.length) continue;
    const radii = new Set(
      bands
        .flatMap((band) => [band.innerRadiusNm, band.outerRadiusNm])
        .filter((radius) => radius > 0),
    );
    for (const radius of radii) drawRing(context, airport, radius, project);
  }
}

function drawRing(context, airport, radius, project) {
  context.beginPath();
  for (let bearing = 0; bearing <= 360; bearing += 7.5) {
    const point = project({
      ...destination(airport, bearing, radius),
      elevationFeet: airport.elevationFeet,
    });
    if (!Number.isFinite(point?.x) || !Number.isFinite(point?.y)) return;
    if (bearing === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  }
  context.stroke();
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
