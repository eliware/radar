import { cameraReadoutRows } from "./readout-values.mjs";

export function drawCameraReadout(context, camera, location, elevationFeet, width) {
  const rows = cameraReadoutRows(camera, location, elevationFeet, width);
  if (!rows) return;
  context.save();
  context.font = '12px Consolas, "Courier New", monospace';
  context.fillStyle = "#00a832";
  context.textBaseline = "alphabetic";
  for (const { value, label, valueX, labelX, y } of rows) {
    drawReadoutRow(context, value, label, valueX, labelX, y);
  }
  context.restore();
}

function drawReadoutRow(context, value, label, valueX, labelX, y) {
  context.textAlign = "right";
  context.fillText(value, valueX, y);
  context.textAlign = "left";
  context.fillText(label, labelX, y);
}
