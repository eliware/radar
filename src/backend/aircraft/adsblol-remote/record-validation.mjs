const MAX_OBSERVATION_AGE_MS = 120_000;

export function validateRemoteAircraftRecord(item) {
  const icao = item?.hex?.trim()?.toUpperCase();
  const latitude = item?.lat;
  const longitude = item?.lon;
  const ageSeconds = Number.isFinite(item?.seen_pos) ? item.seen_pos : item?.seen;
  if (
    !icao ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    !Number.isFinite(ageSeconds) ||
    ageSeconds < 0 ||
    ageSeconds * 1000 > MAX_OBSERVATION_AGE_MS
  )
    return null;
  return { icao, latitude, longitude, ageSeconds };
}
