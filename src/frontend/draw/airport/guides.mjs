import { createRunwayGuidePoints } from "./runway-guides.mjs";

export function drawRunwayGuides(context, end, project, extensionsVisible, baseLegsVisible) {
  const guide = createRunwayGuidePoints(end);
  const outerPoint = extensionsVisible ? project(guide.extensionEnd) : null;
  const origin = extensionsVisible ? project(guide.extensionStart) : null;
  const [left, right] = baseLegsVisible ? guide.baseLegs.map(project) : [null, null];
  const canDrawExtension = extensionsVisible && validPoint(origin) && validPoint(outerPoint);
  const canDrawBaseLegs = baseLegsVisible && validPoint(left) && validPoint(right);
  if (!canDrawExtension && !canDrawBaseLegs) return;
  context.strokeStyle = "#333333";
  context.lineCap = "round";
  context.setLineDash([1, 5]);
  if (canDrawExtension) drawLine(context, origin, outerPoint);
  if (canDrawBaseLegs) drawLine(context, left, right);
  context.setLineDash([]);
}

function drawLine(context, first, second) {
  context.beginPath();
  context.moveTo(first.x, first.y);
  context.lineTo(second.x, second.y);
  context.stroke();
}

function validPoint(point) {
  return Number.isFinite(point?.x) && Number.isFinite(point?.y);
}
