const BOUNDARY_COLOR = "#777777";

export function drawArtccBoundaries(context, boundaries, project) {
  context.save();
  context.strokeStyle = BOUNDARY_COLOR;
  context.lineWidth = 1;
  context.setLineDash([]);
  for (const boundary of boundaries.values()) {
    if (boundary.type !== "ARTCC") continue;
    const points = boundary.points.map(project);
    if (points.length < 2 || points.some((point) => !validPoint(point))) continue;
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (const point of points.slice(1)) context.lineTo(point.x, point.y);
    context.stroke();
  }
  context.restore();
}

function validPoint(point) {
  return Number.isFinite(point?.x) && Number.isFinite(point?.y);
}
