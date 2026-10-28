export function drawAircraftTagLabel(context, tag, fontSize) {
  const anchorX = Math.max(tag.x, Math.min(tag.item.x, tag.x + tag.width));
  const anchorY = Math.max(tag.y, Math.min(tag.item.y, tag.y + tag.height));
  const dx = anchorX - tag.item.x;
  const dy = anchorY - tag.item.y;
  const distance = Math.hypot(dx, dy);
  const divisor = Math.max(distance, Number.EPSILON);
  const gap = Math.min(9, distance);
  context.beginPath();
  context.moveTo(tag.item.x + (dx / divisor) * gap, tag.item.y + (dy / divisor) * gap);
  context.lineTo(anchorX, anchorY);
  context.stroke();
  tag.item.lines.forEach((line, index) => {
    context.fillText(line, tag.x + 7, tag.y + fontSize + index * fontSize * 1.15);
  });
}
