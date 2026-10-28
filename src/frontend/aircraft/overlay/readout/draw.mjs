export function drawCameraReadoutRows(context, rows) {
  context.save();
  context.font = '12px Consolas, "Courier New", monospace';
  context.fillStyle = "#00a832";
  context.textBaseline = "alphabetic";
  for (const { value, label, valueX, labelX, y } of rows) {
    context.textAlign = "right";
    context.fillText(value, valueX, y);
    context.textAlign = "left";
    context.fillText(label, labelX, y);
  }
  context.restore();
}
