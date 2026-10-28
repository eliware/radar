import { createAircraftTypeService } from "./lookup/aircraft/type-service.mjs";
import { createCallsignRouteService } from "./lookup/callsign/route-service.mjs";

export function createAdsbLolLookup({
  request = globalThis.fetch,
  clock = Date.now,
  successTtlMs = 24 * 60 * 60 * 1000,
  routeTtlMs = 60 * 60 * 1000,
  missingTtlMs = 5 * 60 * 1000,
  failureTtlMs = 30 * 1000,
  maxCacheEntries = 256,
} = {}) {
  return {
    getAircraftType: createAircraftTypeService({
      request,
      clock,
      successTtlMs,
      missingTtlMs,
      failureTtlMs,
      maxCacheEntries,
    }),
    getCallsignRoute: createCallsignRouteService({
      request,
      clock,
      routeTtlMs,
      missingTtlMs,
      failureTtlMs,
      maxCacheEntries,
    }),
  };
}
