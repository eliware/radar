import { projectAircraftPosition } from "./aircraft-space-position.mjs";
import { getRadarRingRanges } from "./radar-range.mjs";
import { predictAircraftPosition } from "./predict-aircraft-position.mjs";
import { formatAircraftTag } from "./aircraft-tag-data.mjs";
import { drawAircraftDisplay } from "./draw-aircraft-display.mjs";

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
) {
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
  drawRings(ctx, 0, 0, radius, range);
  ctx.restore();
  const display = [];
  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);
  for (const item of aircraft.values()) {
    const position = projectAircraftPosition(item, location, 0);
    if (!position) continue;
    const project = (point) => ({
      x: centerX + (point.x / range) * radius * cosine - (point.z / range) * radius * sine,
      y: centerY + (point.x / range) * radius * sine + (point.z / range) * radius * cosine,
    });
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
  drawAircraftDisplay(ctx, display, 9, width, height);
  ctx.fillStyle = "#00ff41";
  ctx.beginPath();
  ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawRings(ctx, x, y, radius, range) {
  ctx.textAlign = "left";
  ctx.font = "11px sans-serif";
  for (const nm of getRadarRingRanges(range)) {
    const major = nm % 10 === 0;
    ctx.strokeStyle = major ? "#006b26" : "#003814";
    ctx.lineWidth = major ? 1.5 : 1;
    ctx.beginPath();
    ctx.arc(x, y, (nm / range) * radius, 0, Math.PI * 2);
    ctx.stroke();
    if (major || (range < 10 && nm === Math.floor(range))) {
      drawRingLabel(ctx, x, y, radius, nm, range);
    }
  }
  ctx.strokeStyle = "#00ff41";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - radius, y);
  ctx.lineTo(x + radius, y);
  ctx.moveTo(x, y - radius);
  ctx.lineTo(x, y + radius);
  ctx.stroke();
}

function drawRingLabel(ctx, x, y, radius, nm, range) {
  ctx.fillStyle = "#00ff41";
  const offset = (nm / range) * radius * Math.SQRT1_2;
  ctx.textAlign = "right";
  ctx.fillText(`${nm}`, x - offset - 4, y - offset - 3);
  ctx.textAlign = "left";
}
