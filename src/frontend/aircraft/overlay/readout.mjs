import { default as cameraReadoutRows } from "./readout/values.mjs";
import { default as drawCameraReadoutRows } from "./readout/draw.mjs";

function drawCameraReadout(context, camera, location, elevationFeet, width) {
  const rows = cameraReadoutRows(camera, location, elevationFeet, width);
  if (!rows) return;
  drawCameraReadoutRows(context, rows);
}
export default drawCameraReadout;
