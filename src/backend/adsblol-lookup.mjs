import { default as createAdsbLolTypeService } from "./lookup/adsblol/type-service.mjs";
import { default as createAdsbLolRouteService } from "./lookup/adsblol/route-service.mjs";

function createAdsbLolLookup({
  request = globalThis.fetch,
  clock = Date.now,
  successTtlMs = 24 * 60 * 60 * 1000,
  routeTtlMs = 60 * 60 * 1000,
  missingTtlMs = 5 * 60 * 1000,
  failureTtlMs = 30 * 1000,
  maxCacheEntries = 256,
} = {}) {
  return {
    getAircraftType: createAdsbLolTypeService({
      request,
      clock,
      successTtlMs,
      missingTtlMs,
      failureTtlMs,
      maxCacheEntries,
    }),
    getCallsignRoute: createAdsbLolRouteService({
      request,
      clock,
      routeTtlMs,
      missingTtlMs,
      failureTtlMs,
      maxCacheEntries,
    }),
  };
}
export default createAdsbLolLookup;
