import { drawAirspaceRings } from "./draw-airspace-rings.mjs";
import { drawAirportRunways } from "./draw-airport-runways.mjs";

const AIRPORT_COLOR = "#b8b8b8";

export function drawAirportMarkers(context, airports, project, range) {
  context.save();
  drawAirspaceRings(context, airports, project, range);
  drawAirportRunways(context, airports, project, range);
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
