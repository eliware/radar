const FEET_PER_NM = 6076.12;
const EARTH_RADIUS_NM = 3440.065;

export function cameraReadoutRows(camera, location, elevationFeet, width) {
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
    return null;
  }

  const latitude = location.latitude - (position.z * 180) / (Math.PI * EARTH_RADIUS_NM);
  const longitude =
    location.longitude +
    (position.x * 180) /
      (Math.PI * EARTH_RADIUS_NM * Math.cos((location.latitude * Math.PI) / 180));
  const altitude = Math.round((elevationFeet + position.y * FEET_PER_NM) / 100) * 100;
  const valueX = width - 48;
  const labelX = width - 40;
  return [
    { value: `${formatCoordinate(latitude)}°`, label: "LAT", valueX, labelX, y: 30 },
    { value: `${formatCoordinate(longitude)}°`, label: "LON", valueX, labelX, y: 46 },
    {
      value: `${altitude.toLocaleString("en-US").padStart(9)}'`,
      label: "ALT",
      valueX,
      labelX,
      y: 62,
    },
  ];
}

function formatCoordinate(value) {
  return value.toFixed(4).padStart(9);
}
