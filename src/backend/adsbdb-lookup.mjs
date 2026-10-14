import { hasUsefulCallsign } from "../shared/aircraft-callsign.mjs";
import { createLookupCache } from "./lookup-cache.mjs";

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
  const cache = createLookupCache({ clock, maxEntries: maxCacheEntries });

  function lookup(key, path, select, ttl = successTtlMs) {
    return cache.lookup(
      key,
      async () => {
        const response = await request(`${apiRoot}${path}`);
        if (response.status === 404) return null;
        if (!response.ok) throw new Error("ADSBdb request failed");
        return select(await response.json());
      },
      { successTtlMs: ttl, missingTtlMs, failureTtlMs },
    );
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
