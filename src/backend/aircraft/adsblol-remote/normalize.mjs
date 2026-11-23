import { default as validateRemoteAircraftRecord } from "./record/validation.mjs";
import { default as enrichRemoteAircraftRange } from "./range-enrichment.mjs";
import { default as mapRemoteAircraftRecord } from "./record/mapping.mjs";

function normalizeRemoteAircraft(item, location, now = Date.now()) {
  const validated = validateRemoteAircraftRecord(item);
  if (!validated) return null;
  return enrichRemoteAircraftRange(mapRemoteAircraftRecord(item, validated, now), location);
}
export default normalizeRemoteAircraft;
