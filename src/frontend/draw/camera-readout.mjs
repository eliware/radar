const FEET_PER_NM = 6076.12;
const EARTH_RADIUS_NM = 3440.065;

export function drawCameraReadout(context, camera, location, elevationFeet, width) {
  const position = camera?.position;
  if (
    !position ||
    !location ||
    !Number.isFinite(position.x) ||
    !Number.isFinite(position.y) ||
    !Number.isFinite(position.z) ||
    !Number.isFinite(location.latitude) ||
    !Number.isFinite(location.longitude) ||
    !Number.isFinite(elevationFeet)
  ) {
    return;
  }
  const latitude = location.latitude - (position.z * 180) / (Math.PI * EARTH_RADIUS_NM);
  const longitude =
    location.longitude +
    (position.x * 180) /
      (Math.PI * EARTH_RADIUS_NM * Math.cos((location.latitude * Math.PI) / 180));
  const altitude = Math.round((elevationFeet + position.y * FEET_PER_NM) / 100) * 100;
  context.save();
  context.font = "12px monospace";
  context.fillStyle = "#00a832";
  context.textBaseline = "alphabetic";
  const valueX = width - 48;
  const labelX = width - 40;
  drawReadoutRow(context, `${formatCoordinate(latitude)}°`, "LAT", valueX, labelX, 30);
  drawReadoutRow(context, `${formatCoordinate(longitude)}°`, "LON", valueX, labelX, 46);
  drawReadoutRow(
    context,
    `${altitude.toLocaleString("en-US").padStart(9)}'`,
    "ALT",
    valueX,
    labelX,
    62,
  );
  context.restore();
}

function drawReadoutRow(context, value, label, valueX, labelX, y) {
  context.textAlign = "right";
  context.fillText(value, valueX, y);
  context.textAlign = "left";
  context.fillText(label, labelX, y);
}

function formatCoordinate(value) {
  return value.toFixed(4).padStart(9);
}
