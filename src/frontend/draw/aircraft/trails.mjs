export function drawAircraftTrails(context, aircraft, fontSize, trailColor) {
  context.fillStyle = trailColor;
  context.font = `${fontSize / 2}px Consolas, "Courier New", monospace`;
  for (const item of aircraft) {
    for (const point of (item.history ?? []).slice(0, -1)) {
      context.fillText(String.fromCharCode(92), point.x, point.y);
    }
  }
}
