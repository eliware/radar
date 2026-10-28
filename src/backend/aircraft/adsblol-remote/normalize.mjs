import { validateRemoteAircraftRecord } from "./record-validation.mjs";
import { enrichRemoteAircraftRange } from "./range-enrichment.mjs";

export function normalizeRemoteAircraft(item, location, now = Date.now()) {
  const validated = validateRemoteAircraftRecord(item);
  if (!validated) return null;
  const { icao, latitude, longitude, ageSeconds } = validated;
  return enrichRemoteAircraftRange(
    {
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
      lastSeen: now - ageSeconds * 1000,
      remoteOnly: true,
    },
    location,
  );
}

function optionalNumber(name, value) {
  return Number.isFinite(value) ? { [name]: value } : {};
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}
