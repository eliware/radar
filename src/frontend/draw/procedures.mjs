import { clipProcedureSegment } from "../clip/procedure-segment.mjs";

const COLORS = { SID: "#2b3d4d", STAR: "#50402e" };

export function drawProcedures(
  context,
  procedures,
  project,
  range,
  visibility = { sidVisible: true, starVisible: true },
) {
  if (visibility === false) return;
  context.save();
  context.lineWidth = 1;
  context.font = "10px monospace";
  context.textAlign = "center";
  context.setLineDash([3, 3]);
  for (const procedure of procedures.values()) {
    if (procedure.type !== "SID" && procedure.type !== "STAR") continue;
    const visible =
      procedure.type === "SID" ? visibility.sidVisible !== false : visibility.starVisible !== false;
    if (visible) drawProcedure(context, procedure, project, range);
  }
  context.setLineDash([]);
  context.restore();
}

function drawProcedure(context, procedure, project, range) {
  context.strokeStyle = COLORS[procedure.type];
  context.fillStyle = context.strokeStyle;
  const points = procedure.points.map((point) => ({ ...point, screen: project(point) }));
  drawRoute(context, points, range);
  context.setLineDash([]);
  for (const point of points) {
    if (point.viewportCut || point.rangeNm > range || !valid(point.screen)) continue;
    drawPyramid(context, point.screen);
    if (point.label) context.fillText(point.fix, point.screen.x, point.screen.y - 6);
  }
  context.setLineDash([3, 3]);
}

function drawRoute(context, points, range) {
  for (let index = 1; index < points.length; index += 1) {
    const from = points[index - 1];
    const to = points[index];
    if (!valid(from.screen) || !valid(to.screen)) continue;
    const segment = clipProcedureSegment(from, to, range);
    if (!segment) continue;
    context.beginPath();
    context.moveTo(segment.from.x, segment.from.y);
    context.lineTo(segment.to.x, segment.to.y);
    context.stroke();
  }
}

function drawPyramid(context, point) {
  context.beginPath();
  context.moveTo(point.x, point.y - 3);
  context.lineTo(point.x + 3, point.y + 2);
  context.lineTo(point.x - 3, point.y + 2);
  context.closePath();
  context.stroke();
}

function valid(point) {
  return Number.isFinite(point?.x) && Number.isFinite(point?.y);
}
