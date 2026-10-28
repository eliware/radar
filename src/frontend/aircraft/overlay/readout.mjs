import { cameraReadoutRows } from "./readout/values.mjs";
import { drawCameraReadoutRows } from "./readout/draw.mjs";

export function drawCameraReadout(context, camera, location, elevationFeet, width) {
  const rows = cameraReadoutRows(camera, location, elevationFeet, width);
  if (!rows) return;
  drawCameraReadoutRows(context, rows);
}
