import { default as createAircraftTypeService } from "../aircraft/type-service.mjs";

function createAdsbLolTypeService({
  request,
  clock,
  successTtlMs = 24 * 60 * 60 * 1000,
  missingTtlMs = 5 * 60 * 1000,
  failureTtlMs = 30 * 1000,
  maxCacheEntries = 256,
} = {}) {
  return createAircraftTypeService({
    request,
    clock,
    successTtlMs,
    missingTtlMs,
    failureTtlMs,
    maxCacheEntries,
  });
}
export default createAdsbLolTypeService;
