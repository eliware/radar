import { MAX_RADAR_RANGE } from "../radar/range.mjs";
import { buildIlsCourseGeometry } from "../ils-course-geometry.mjs";
import { safeIlsElevation } from "../safe-ils-elevation.mjs";

const ILS_COLOR = "#604080";

export function drawIlsApproaches(context, approaches, project, visible = true) {
  if (!visible) return;
  context.save();
  context.strokeStyle = ILS_COLOR;
  context.lineWidth = 1.25;
  context.setLineDash([4, 4]);
  for (const approach of approaches.values()) {
    if (approach.rangeNm > MAX_RADAR_RANGE) continue;
    const course = buildIlsCourseGeometry(approach);
    if (!course) continue;
    const origin = project({ ...approach, elevationFeet: course.elevationFeet });
    const endpoint = project(course.endpoint);
    if (!validPoint(origin) || !validPoint(endpoint)) continue;
    context.beginPath();
    context.moveTo(endpoint.x, endpoint.y);
    context.lineTo(origin.x, origin.y);
    context.stroke();
    drawMarkers(context, approach.markers ?? [], project);
  }
  context.restore();
}

function drawMarkers(context, markers, project) {
  context.setLineDash([]);
  for (const marker of markers) {
    if (marker.rangeNm > MAX_RADAR_RANGE) continue;
    const point = project({ ...marker, elevationFeet: safeIlsElevation(marker) });
    if (!validPoint(point)) continue;
    context.beginPath();
    context.arc(point.x, point.y, 3, 0, Math.PI * 2);
    context.stroke();
  }
  context.setLineDash([4, 4]);
}

function validPoint(point) {
  return Number.isFinite(point?.x) && Number.isFinite(point?.y);
}
