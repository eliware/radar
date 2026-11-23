import { MAX_RADAR_RANGE } from "../radar/range.mjs";
import { default as clipProcedureSegment } from "../clip/procedure-segment.mjs";
import { default as drawProcedureWaypoints } from "./procedure-waypoints.mjs";

const COLORS = { SID: "#2b3d4d", STAR: "#50402e" };

function drawProcedures(
  context,
  procedures,
  project,
  visibility = { sidVisible: true, starVisible: true },
) {
  if (visibility === false) return;
  context.save();
  context.lineWidth = 1;
  context.font = '10px Consolas, "Courier New", monospace';
  context.textAlign = "center";
  context.setLineDash([3, 3]);
  for (const procedure of procedures.values()) {
    if (procedure.type !== "SID" && procedure.type !== "STAR") continue;
    const visible =
      procedure.type === "SID" ? visibility.sidVisible !== false : visibility.starVisible !== false;
    if (visible) drawProcedure(context, procedure, project);
  }
  context.setLineDash([]);
  context.restore();
}

function drawProcedure(context, procedure, project) {
  context.strokeStyle = COLORS[procedure.type];
  context.fillStyle = context.strokeStyle;
  const points = procedure.points.map((point) => ({ ...point, screen: project(point) }));
  drawRoute(context, points);
  context.setLineDash([]);
  drawProcedureWaypoints(context, points);
  context.setLineDash([3, 3]);
}

function drawRoute(context, points) {
  for (let index = 1; index < points.length; index += 1) {
    const from = points[index - 1];
    const to = points[index];
    if (!valid(from.screen) || !valid(to.screen)) continue;
    const segment = clipProcedureSegment(from, to, MAX_RADAR_RANGE);
    if (!segment) continue;
    context.beginPath();
    context.moveTo(segment.from.x, segment.from.y);
    context.lineTo(segment.to.x, segment.to.y);
    context.stroke();
  }
}

function valid(point) {
  return Number.isFinite(point?.x) && Number.isFinite(point?.y);
}
export default drawProcedures;
