import { projectAircraftPosition } from "./aircraft-space-position.mjs";
import { predictAircraftPosition } from "./predict-aircraft-position.mjs";
import { formatAircraftTag } from "./aircraft-tag-data.mjs";
import { drawAircraftDisplay } from "./draw-aircraft-display.mjs";
import { drawRadarScaleLegend } from "./draw-radar-scale-legend.mjs";
import { getRadarPalette } from "./radar-palette.mjs";
import { drawCanvasRings } from "./draw-canvas-rings.mjs";
import { drawRadarReferences } from "./draw-radar-references.mjs";
import { createRadarScopePath } from "./create-radar-scope-path.mjs";
import { drawMapOutlines } from "./draw-map-outlines.mjs";

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
  ilsApproaches = new Map(),
  ilsVisible = true,
  procedures = new Map(),
  proceduresVisible = true,
  mapOutlines = null,
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
  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);
  const project = (point) => ({
    x: centerX + (point.x / range) * radius * cosine - (point.z / range) * radius * sine,
    y: centerY + (point.x / range) * radius * sine + (point.z / range) * radius * cosine,
  });
  drawMapOutlines(ctx, mapOutlines, location, project, { x: centerX, y: centerY }, radius);
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  drawCanvasRings(ctx, 0, 0, radius, range, palette);
  ctx.restore();
  drawRadarReferences(
    ctx,
    { airports, navaids, boundaries, ilsApproaches, procedures },
    (item) => {
      const position = projectAircraftPosition(
        { ...item, altitudeFeet: Number.isFinite(item.elevationFeet) ? item.elevationFeet : 0 },
        location,
        0,
      );
      return position ? project(position) : null;
    },
    range,
    ilsVisible,
    proceduresVisible,
    createRadarScopePath(range, (point) => ({
      x: centerX + (point.x / range) * radius,
      y: centerY + (point.z / range) * radius,
    })),
  );
  const display = [];
  for (const item of aircraft.values()) {
    const position = projectAircraftPosition(item, location, 0);
    if (!position) continue;
    const marker = project(position);
    const future = predictAircraftPosition(position, item);
    const history = trails.get(item.icao) ?? [];
    display.push({
      ...marker,
      receivedAt: item.receivedAt,
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
  drawRadarScaleLegend(ctx, width, height, range, radius, connected, ilsVisible);
}
