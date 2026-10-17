const FEET_PER_NM = 6076.12;
const EARTH_RADIUS_NM = 3440.065;

export function drawCameraReadout(context, camera, location, elevationFeet) {
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
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  context.fillText(`LAT ${formatCoordinate(latitude)}°`, 18, 30);
  context.fillText(`LON ${formatCoordinate(longitude)}°`, 18, 46);
  context.fillText(`ALT ${altitude.toLocaleString("en-US").padStart(9)}'`, 18, 62);
  context.restore();
}

function formatCoordinate(value) {
  return value.toFixed(4).padStart(9);
}
