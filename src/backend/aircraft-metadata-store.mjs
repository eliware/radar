const MAX_ENTRIES = 256;

export function createAircraftMetadataStore(limit = MAX_ENTRIES) {
  const typesByIcao = new Map();
  const routesByCallsign = new Map();

  function remember(cache, key, value) {
    const before = cache.get(key) ?? {};
    cache.delete(key);
    cache.set(key, value);
    if (cache.size > limit) cache.delete(cache.keys().next().value);
    return !sameLookupData(before, value);
  }

  return {
    enrich(aircraft) {
      return {
        ...aircraft,
        ...typesByIcao.get(normalizeAircraftMetadataKey(aircraft.icao)),
        ...routesByCallsign.get(normalizeAircraftMetadataKey(aircraft.callsign)),
      };
    },
    updateType(icao, result) {
      return result?.aircraftTypeCode ? remember(typesByIcao, icao, result) : false;
    },
    updateRoute(callsign, result) {
      return result?.origin || result?.destination
        ? remember(routesByCallsign, callsign, result)
        : false;
    },
  };
}

export function normalizeAircraftMetadataKey(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

function sameLookupData(before, after) {
  return (
    before.aircraftTypeCode === after.aircraftTypeCode &&
    before.origin === after.origin &&
    before.destination === after.destination
  );
}
