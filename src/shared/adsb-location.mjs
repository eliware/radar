export function parseAdsbLocation(latitudeValue, longitudeValue) {
  const hasLatitude = latitudeValue !== undefined && latitudeValue.trim() !== "";
  const hasLongitude = longitudeValue !== undefined && longitudeValue.trim() !== "";
  if (!hasLatitude && !hasLongitude) return null;
  if (!hasLatitude || !hasLongitude) {
    throw new Error("ADSB_LAT and ADSB_LON must both be set.");
  }
  const latitude = Number(latitudeValue);
  const longitude = Number(longitudeValue);
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error("ADSB_LAT and ADSB_LON must be valid coordinates.");
  }
  return { latitude, longitude };
}
