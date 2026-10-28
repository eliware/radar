import { MAX_RADAR_RANGE } from "../radar/range.mjs";
import { airportAirspaceBands } from "../airport-airspace/bands.mjs";
import { airportAirspaceEdges } from "../airport-airspace/edges.mjs";
import { runwayDestination } from "../runway-destination.mjs";

const RING_COLOR = "#777777";

export function drawAirspaceRings(context, airports, project) {
  context.strokeStyle = RING_COLOR;
  context.lineWidth = 1;
  context.setLineDash([]);
  for (const airport of airports.values()) {
    if (airport.rangeNm > MAX_RADAR_RANGE) continue;
    const bands = airportAirspaceBands(airport);
    if (!bands.length) continue;
    const groundFeet = Number.isFinite(airport.elevationFeet) ? airport.elevationFeet : 0;
    const { rings } = airportAirspaceEdges(bands, groundFeet);
    const radii = new Set(rings.map(({ radius }) => radius));
    for (const radius of radii) drawRing(context, airport, radius, project);
  }
}

function drawRing(context, airport, radius, project) {
  context.beginPath();
  for (let bearing = 0; bearing <= 360; bearing += 7.5) {
    const point = project({
      ...runwayDestination(airport, bearing, radius),
      elevationFeet: airport.elevationFeet,
    });
    if (!Number.isFinite(point?.x) || !Number.isFinite(point?.y)) return;
    if (bearing === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  }
  context.stroke();
}
