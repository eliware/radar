import { projectMapCoordinate } from "./project-map-coordinate.mjs";

export function drawMapOutlines(context, outlines, location, project, center, radius) {
  if (!location || !outlines) return;
  context.save();
  context.beginPath();
  context.arc(center.x, center.y, radius, 0, Math.PI * 2);
  context.clip();
  context.strokeStyle = "#383838";
  context.lineWidth = 1;
  context.setLineDash([]);
  for (const layer of [outlines.coastline, outlines.lakes]) drawLayer(layer);
  context.restore();

  function drawLayer(paths = []) {
    for (const path of paths) {
      let started = false;
      context.beginPath();
      for (let index = 0; index < path.length; index += 1) {
        const relative = projectMapCoordinate(path[index], location);
        const point = relative ? project(relative) : null;
        if (!point) {
          started = false;
          continue;
        }
        if (started) context.lineTo(point.x, point.y);
        else context.moveTo(point.x, point.y);
        started = true;
      }
      context.stroke();
    }
  }
}
