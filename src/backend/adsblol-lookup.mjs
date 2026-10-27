import { createLookupCache } from "./lookup-cache.mjs";
import { createAircraftTypeLookup } from "./lookup/aircraft-type.mjs";
import { createCallsignRouteLookup } from "./lookup/callsign-route.mjs";

export function createAdsbLolLookup({
  request = globalThis.fetch,
  clock = Date.now,
  successTtlMs = 24 * 60 * 60 * 1000,
  routeTtlMs = 60 * 60 * 1000,
  missingTtlMs = 5 * 60 * 1000,
  failureTtlMs = 30 * 1000,
  maxCacheEntries = 256,
} = {}) {
  const cache = createLookupCache({ clock, maxEntries: maxCacheEntries });
  const options = { successTtlMs, missingTtlMs, failureTtlMs };
  const lookup = (key, load, ttl = successTtlMs) =>
    cache.lookup(key, load, { ...options, successTtlMs: ttl });
  return {
    getAircraftType: createAircraftTypeLookup(request, lookup),
    getCallsignRoute: createCallsignRouteLookup(request, lookup, routeTtlMs),
  };
}
