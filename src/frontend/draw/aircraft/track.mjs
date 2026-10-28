export function drawAircraftTrack(context, item) {
  if (Number.isFinite(item.futureX) && Number.isFinite(item.futureY)) {
    context.beginPath();
    context.moveTo(item.x, item.y);
    context.lineTo(item.futureX, item.futureY);
    context.stroke();
  }
  const size = 4;
  context.beginPath();
  context.moveTo(item.x, item.y - size);
  context.lineTo(item.x + size, item.y);
  context.lineTo(item.x, item.y + size);
  context.lineTo(item.x - size, item.y);
  context.closePath();
  context.stroke();
}
