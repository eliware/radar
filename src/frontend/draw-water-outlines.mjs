import { projectAircraftPosition } from "./aircraft-space-position.mjs";

export function drawWaterOutlines(context, paths, project, location) {
  context.save();
  context.strokeStyle = "rgba(125, 125, 125, 0.45)";
  context.lineWidth = 1;
  for (const path of paths) {
    const points = path
      .map((point) => {
        const position = projectAircraftPosition({ ...point, altitudeFeet: 0 }, location, 0);
        return position ? project(position) : null;
      })
      .filter(Boolean);
    if (points.length < 2) continue;
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (const point of points.slice(1)) context.lineTo(point.x, point.y);
    context.stroke();
  }
  context.restore();
}
