const NAVAID_COLOR = "#4da3ff";

export function drawNavaidMarkers(context, navaids, project, range) {
  context.save();
  context.strokeStyle = NAVAID_COLOR;
  context.fillStyle = NAVAID_COLOR;
  context.lineWidth = 1;
  context.font = "12px monospace";
  context.textAlign = "left";
  for (const navaid of navaids.values()) {
    if (navaid.rangeNm > range) continue;
    const point = project(navaid);
    if (!Number.isFinite(point?.x) || !Number.isFinite(point?.y)) continue;
    context.beginPath();
    context.arc(point.x, point.y, 4, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.moveTo(point.x - 6, point.y);
    context.lineTo(point.x + 6, point.y);
    context.moveTo(point.x, point.y - 6);
    context.lineTo(point.x, point.y + 6);
    context.stroke();
    context.fillText(navaid.identifier, point.x + 7, point.y - 5);
  }
  context.restore();
}
