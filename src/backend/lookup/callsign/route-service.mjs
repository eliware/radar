import { createLookupCache } from "../../lookup-cache.mjs";
import { createCallsignRouteLookup } from "./route.mjs";

export function createCallsignRouteService({
  request,
  clock = Date.now,
  routeTtlMs = 60 * 60 * 1000,
  missingTtlMs = 5 * 60 * 1000,
  failureTtlMs = 30 * 1000,
  maxCacheEntries = 256,
}) {
  const cache = createLookupCache({ clock, maxEntries: maxCacheEntries });
  const lookup = (key, load, ttl) =>
    cache.lookup(key, load, {
      successTtlMs: ttl,
      missingTtlMs,
      failureTtlMs,
    });
  return createCallsignRouteLookup(request, lookup, routeTtlMs);
}
