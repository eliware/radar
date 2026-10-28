import { validateRemoteAircraftRecord } from "./record/validation.mjs";
import { enrichRemoteAircraftRange } from "./range-enrichment.mjs";
import { mapRemoteAircraftRecord } from "./record/mapping.mjs";

export function normalizeRemoteAircraft(item, location, now = Date.now()) {
  const validated = validateRemoteAircraftRecord(item);
  if (!validated) return null;
  return enrichRemoteAircraftRange(mapRemoteAircraftRecord(item, validated, now), location);
}
