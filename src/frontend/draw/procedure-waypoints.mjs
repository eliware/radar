import { MAX_RADAR_RANGE } from "../radar/range.mjs";

function drawProcedureWaypoints(context, points) {
  for (const point of points) {
    if (point.viewportCut || point.rangeNm > MAX_RADAR_RANGE || !valid(point.screen)) continue;
    context.beginPath();
    context.moveTo(point.screen.x, point.screen.y - 3);
    context.lineTo(point.screen.x + 3, point.screen.y + 2);
    context.lineTo(point.screen.x - 3, point.screen.y + 2);
    context.closePath();
    context.stroke();
    if (point.label) context.fillText(point.fix, point.screen.x, point.screen.y - 6);
  }
}

function valid(point) {
  return Number.isFinite(point?.x) && Number.isFinite(point?.y);
}
export default drawProcedureWaypoints;
