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
  const altitude = Math.round(elevationFeet + position.y * FEET_PER_NM);
  context.save();
  context.font = "12px monospace";
  context.fillStyle = "#00a832";
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  context.fillText(`LAT ${latitude.toFixed(4)}°`, 18, 30);
  context.fillText(`LON ${longitude.toFixed(4)}°`, 18, 46);
  context.fillText(`ALT ${altitude} ft MSL`, 18, 62);
  context.restore();
}
