const COLORS = { SID: "#29a8ff", STAR: "#ffb347" };

export function drawProcedures(context, procedures, project, range, visible = true, scope = null) {
  if (!visible) return;
  context.save();
  clipScope(context, scope);
  context.lineWidth = 1;
  context.font = "10px monospace";
  context.textAlign = "center";
  for (const procedure of procedures.values()) drawProcedure(context, procedure, project, range);
  context.restore();
}

function clipScope(context, scope) {
  if (!Array.isArray(scope) || scope.length < 3 || scope.some((point) => !valid(point))) return;
  context.beginPath();
  context.moveTo(scope[0].x, scope[0].y);
  for (const point of scope.slice(1)) context.lineTo(point.x, point.y);
  context.closePath();
  context.clip();
}

function drawProcedure(context, procedure, project, range) {
  context.strokeStyle = COLORS[procedure.type] ?? COLORS.SID;
  context.fillStyle = context.strokeStyle;
  const points = procedure.points.map((point) => ({ ...point, screen: project(point) }));
  drawRoute(context, points, range);
  for (const point of points) {
    if (point.rangeNm > range || !valid(point.screen)) continue;
    drawPyramid(context, point.screen);
    if (point.label) context.fillText(point.fix, point.screen.x, point.screen.y - 6);
  }
}

function drawRoute(context, points, range) {
  for (let index = 1; index < points.length; index += 1) {
    const from = points[index - 1];
    const to = points[index];
    if (!valid(from.screen) || !valid(to.screen)) continue;
    const segment = clipSegment(from, to, range);
    if (!segment) continue;
    context.beginPath();
    context.moveTo(segment.from.x, segment.from.y);
    context.lineTo(segment.to.x, segment.to.y);
    context.stroke();
  }
}

function clipSegment(from, to, range) {
  const fromInside = from.rangeNm <= range;
  const toInside = to.rangeNm <= range;
  if (fromInside && toInside) return { from: from.screen, to: to.screen };
  if (!fromInside && !toInside) return null;
  const fraction = (range - from.rangeNm) / (to.rangeNm - from.rangeNm);
  const edge = {
    x: from.screen.x + (to.screen.x - from.screen.x) * fraction,
    y: from.screen.y + (to.screen.y - from.screen.y) * fraction,
  };
  return fromInside ? { from: from.screen, to: edge } : { from: edge, to: to.screen };
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
