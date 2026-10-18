import { calculateAircraftRange } from "../../shared/aircraft/range.mjs";

const MAX_OBSERVATION_AGE_MS = 120_000;

export function normalizeRemoteAircraft(item, location, now = Date.now()) {
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
  return {
    icao,
    latitude,
    longitude,
    ...optionalNumber("altitudeFeet", item.alt_baro ?? item.alt_geom),
    ...optionalNumber("groundSpeedKnots", item.gs),
    ...optionalNumber("trackDegrees", item.track ?? item.true_heading ?? item.dir),
    ...optionalNumber("verticalRateFeetPerMinute", item.baro_rate ?? item.geom_rate),
    ...(text(item.flight) ? { callsign: text(item.flight) } : {}),
    ...(text(item.t) ? { aircraftTypeCode: text(item.t) } : {}),
    ...(text(item.squawk) ? { squawk: text(item.squawk) } : {}),
    ...(text(item.emergency) ? { emergency: text(item.emergency) } : {}),
    ...calculateAircraftRange(location, { latitude, longitude }),
    lastSeen: now - ageSeconds * 1000,
    remoteOnly: true,
  };
}

function optionalNumber(name, value) {
  return Number.isFinite(value) ? { [name]: value } : {};
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}
