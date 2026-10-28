import { createCallsignRouteService } from "../callsign/route/service.mjs";

export function createAdsbLolRouteService({
  request,
  clock,
  routeTtlMs = 60 * 60 * 1000,
  missingTtlMs = 5 * 60 * 1000,
  failureTtlMs = 30 * 1000,
  maxCacheEntries = 256,
} = {}) {
  return createCallsignRouteService({
    request,
    clock,
    routeTtlMs,
    missingTtlMs,
    failureTtlMs,
    maxCacheEntries,
  });
}
