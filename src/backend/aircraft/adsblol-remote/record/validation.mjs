const MAX_OBSERVATION_AGE_MS = 120_000;

export function validateRemoteAircraftRecord(item) {
  const icao = typeof item?.hex === "string" ? item.hex.trim().toUpperCase() : "";
  const latitude = item?.lat;
  const longitude = item?.lon;
  const ageSeconds = Number.isFinite(item?.seen_pos) ? item.seen_pos : item?.seen;
  if (
    !/^[0-9A-F]{6}$/.test(icao) ||
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180 ||
    !Number.isFinite(ageSeconds) ||
    ageSeconds < 0 ||
    ageSeconds * 1000 > MAX_OBSERVATION_AGE_MS
  )
    return null;
  return { icao, latitude, longitude, ageSeconds };
}
