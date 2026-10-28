export function drawHomeMarker(context, centerX, centerY, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(centerX, centerY, 5, 0, Math.PI * 2);
  context.fill();
}
