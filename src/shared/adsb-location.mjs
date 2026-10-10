export function parseAdsbLocation(value) {
  if (value === undefined || value.trim() === "") return null;
  const parts = value.split(",").map((part) => part.trim());
  if (parts.length !== 2 || parts.some((part) => part === "")) {
    throw new Error('MY_LOCATION must use "latitude, longitude".');
  }
  const [latitude, longitude] = parts.map(Number);
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error("MY_LOCATION must use valid latitude and longitude values.");
  }
  return { latitude, longitude };
}
