import { MAX_RADAR_RANGE } from "../radar/range.mjs";
import { selectCanvasLabelSize } from "./label-size.mjs";
const COLORS = { Q: "#31534d", J: "#54394b", V: "#4f4d32" };

export function drawAirways(context, airways, project, visibility) {
  context.save();
  context.font = `${selectCanvasLabelSize(context, 10)}px Consolas, "Courier New", monospace`;
  context.textAlign = "center";
  for (const airway of airways.values()) {
    const color = COLORS[airway.type];
    if (!color || visibility[airway.type] === false) continue;
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = 1;
    context.setLineDash([3, 3]);
    const points = airway.points.map((item) => ({ ...item, screen: project(item) }));
    drawSegments(context, airway.name, points, MAX_RADAR_RANGE);
    context.setLineDash([]);
    for (const point of points) {
      if (point.viewportCut || point.rangeNm > MAX_RADAR_RANGE || !valid(point.screen)) continue;
      drawFix(context, point.screen);
      context.fillText(point.fix, point.screen.x + 7, point.screen.y - 5);
    }
  }
  context.setLineDash([]);
  context.restore();
}

function drawSegments(context, name, points, range) {
  for (let index = 1; index < points.length; index += 1) {
    const from = points[index - 1];
    const to = points[index];
    if (!valid(from.screen) || !valid(to.screen) || closestRange(from, to) > range) continue;
    context.beginPath();
    context.moveTo(from.screen.x, from.screen.y);
    context.lineTo(to.screen.x, to.screen.y);
    context.stroke();
    context.fillText(name, (from.screen.x + to.screen.x) / 2, (from.screen.y + to.screen.y) / 2);
  }
}

function closestRange(from, to) {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  const t = Math.max(0, Math.min(1, -(from.x * dx + from.z * dz) / (dx * dx + dz * dz || 1)));
  return Math.hypot(from.x + t * dx, from.z + t * dz);
}

function drawFix(context, point) {
  context.beginPath();
  context.moveTo(point.x, point.y - 3);
  context.lineTo(point.x + 3, point.y);
  context.lineTo(point.x, point.y + 3);
  context.lineTo(point.x - 3, point.y);
  context.closePath();
  context.stroke();
}

function valid(point) {
  return Number.isFinite(point?.x) && Number.isFinite(point?.y);
}
