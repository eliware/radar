import { hasUsefulCallsign } from "../shared/aircraft-callsign.mjs";

const apiRoot = "https://api.adsbdb.com/v0";
const day = 24 * 60 * 60 * 1000;

export function createAdsbdbLookup({
  request = globalThis.fetch,
  clock = Date.now,
  successTtlMs = day,
  routeTtlMs = 60 * 60 * 1000,
  missingTtlMs = 5 * 60 * 1000,
  failureTtlMs = 30 * 1000,
  maxCacheEntries = 256,
} = {}) {
  const cache = new Map();

  function lookup(key, path, select, ttl = successTtlMs) {
    const cached = cache.get(key);
    if (cached?.promise) return cached.promise;
    if (cached && cached.expiresAt > clock()) return Promise.resolve(cached.value);
    cache.delete(key);
    const entry = { expiresAt: Infinity, promise: null, value: null };
    entry.promise = Promise.resolve()
      .then(() => request(`${apiRoot}${path}`))
      .then(async (response) => {
        if (response.status === 404) return save(entry, null, missingTtlMs);
        if (!response.ok) throw new Error("ADSBdb request failed");
        const value = select(await response.json());
        return save(entry, value, value ? ttl : missingTtlMs);
      })
      .catch(() => save(entry, null, failureTtlMs));
    cache.set(key, entry);
    if (cache.size > maxCacheEntries) cache.delete(cache.keys().next().value);
    return entry.promise;
  }

  function save(entry, value, ttl) {
    entry.value = value;
    entry.expiresAt = clock() + ttl;
    entry.promise = null;
    return value;
  }

  return {
    getAircraftType(icao) {
      const key = normalize(icao);
      if (!key) return Promise.resolve(null);
      return lookup(`aircraft:${key}`, `/aircraft/${encodeURIComponent(key)}`, (body) => {
        const code = body?.response?.aircraft?.icao_type;
        return typeof code === "string" && code.trim() ? { aircraftTypeCode: code.trim() } : null;
      });
    },
    getCallsignRoute(callsign) {
      const key = normalize(callsign);
      if (!hasUsefulCallsign(key)) return Promise.resolve(null);
      return lookup(
        `callsign:${key}`,
        `/callsign/${encodeURIComponent(key)}`,
        (body) => {
          const route = body?.response?.flightroute;
          const origin = airportCode(route?.origin?.icao_code);
          const destination = airportCode(route?.destination?.icao_code);
          if (!origin && !destination) return null;
          return {
            ...(origin ? { origin } : {}),
            ...(destination ? { destination } : {}),
          };
        },
        routeTtlMs,
      );
    },
  };
}

function normalize(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

function airportCode(value) {
  return typeof value === "string" && value.trim() ? value.trim().toUpperCase() : null;
}
