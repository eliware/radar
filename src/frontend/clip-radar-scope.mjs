export function clipRadarScope(context, scope) {
  if (!Array.isArray(scope) || scope.length < 3 || scope.some((point) => !valid(point)))
    return false;
  context.beginPath();
  context.moveTo(scope[0].x, scope[0].y);
  for (const point of scope.slice(1)) context.lineTo(point.x, point.y);
  context.closePath();
  context.clip();
  return true;
}

function valid(point) {
  return Number.isFinite(point?.x) && Number.isFinite(point?.y);
}
