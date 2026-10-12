import { projectAircraftPosition } from "./aircraft-space-position.mjs";
import { predictAircraftPosition } from "./predict-aircraft-position.mjs";
import { formatAircraftTag } from "./aircraft-tag-data.mjs";
import { drawAircraftDisplay } from "./draw-aircraft-display.mjs";
import { drawRadarScaleLegend } from "./draw-radar-scale-legend.mjs";
import { getRadarPalette } from "./radar-palette.mjs";
import { drawAirportMarkers } from "./draw-airport-markers.mjs";
import { drawCanvasRings } from "./draw-canvas-rings.mjs";
import { drawNavaidMarkers } from "./draw-navaid-markers.mjs";
import { drawArtccBoundaries } from "./draw-artcc-boundaries.mjs";

export function drawCanvasRadar(
  ctx,
  canvas,
  aircraft,
  location,
  range,
  panX,
  panY,
  windowRef,
  rotation = 0,
  trails = new Map(),
  connected = true,
  airports = new Map(),
  navaids = new Map(),
  boundaries = new Map(),
) {
  const palette = getRadarPalette(connected);
  const width = canvas.clientWidth || 1;
  const height = canvas.clientHeight || 1;
  const ratio = Math.min(windowRef.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  const radius = Math.max(1, Math.min(width, height) * 0.44);
  const centerX = width / 2 + panX;
  const centerY = height / 2 + panY;
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  drawCanvasRings(ctx, 0, 0, radius, range, palette);
  ctx.restore();
  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);
  const project = (point) => ({
    x: centerX + (point.x / range) * radius * cosine - (point.z / range) * radius * sine,
    y: centerY + (point.x / range) * radius * sine + (point.z / range) * radius * cosine,
  });
  drawAirportMarkers(
    ctx,
    airports,
    (airport) => {
      const position = projectAircraftPosition(airportPosition(airport), location, 0);
      return position ? project(position) : null;
    },
    range,
  );
  drawNavaidMarkers(
    ctx,
    navaids,
    (navaid) => {
      const position = projectAircraftPosition(airportPosition(navaid), location, 0);
      return position ? project(position) : null;
    },
    range,
  );
  drawArtccBoundaries(ctx, boundaries, (point) => {
    const position = projectAircraftPosition({ ...point, altitudeFeet: 0 }, location, 0);
    return position ? project(position) : null;
  });
  const display = [];
  for (const item of aircraft.values()) {
    const position = projectAircraftPosition(item, location, 0);
    if (!position) continue;
    const marker = project(position);
    const future = predictAircraftPosition(position, item);
    const history = trails.get(item.icao) ?? [];
    display.push({
      ...marker,
      futureX: future ? project(future).x : null,
      futureY: future ? project(future).y : null,
      lines: formatAircraftTag(item),
      history: history.map(project),
    });
  }
  drawAircraftDisplay(ctx, display, 9, width, height, connected);
  ctx.fillStyle = palette.bright;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
  ctx.fill();
  drawRadarScaleLegend(ctx, width, height, range, radius, connected);
}

function airportPosition(airport) {
  return { ...airport, altitudeFeet: airport.elevationFeet };
}
