import { createLookupCache } from "../../lookup-cache.mjs";
import { createAircraftTypeLookup } from "./type.mjs";

export function createAircraftTypeService({
  request,
  clock = Date.now,
  successTtlMs = 24 * 60 * 60 * 1000,
  missingTtlMs = 5 * 60 * 1000,
  failureTtlMs = 30 * 1000,
  maxCacheEntries = 256,
}) {
  const cache = createLookupCache({ clock, maxEntries: maxCacheEntries });
  const lookup = (key, load) =>
    cache.lookup(key, load, { successTtlMs, missingTtlMs, failureTtlMs });
  return createAircraftTypeLookup(request, lookup);
}
