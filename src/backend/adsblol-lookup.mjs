import { hasUsefulCallsign } from "../shared/aircraft/callsign.mjs";
import { createLookupCache } from "./lookup-cache.mjs";

const apiRoot = "https://api.adsb.lol";
const routeRoot = "https://vrs-standing-data.adsb.lol/routes";
const userAgent = "EliwareRadar/15.0.0 (+https://radar.purinton.us; contact: radar@eliware.org)";

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
    getAircraftType(value) {
      const hex = normalize(value);
      if (!hex) return Promise.resolve(null);
      return lookup(`aircraft:${hex}`, async () => {
        const body = await fetchJson(`${apiRoot}/v2/hex/${encodeURIComponent(hex)}`, request);
        const aircraft = body?.ac?.find((item) => normalize(item.hex) === hex);
        const code = aircraft?.t;
        return typeof code === "string" && code.trim() ? { aircraftTypeCode: code.trim() } : null;
      });
    },
    getCallsignRoute(value) {
      const callsign = normalize(value);
      if (!hasUsefulCallsign(callsign)) return Promise.resolve(null);
      return lookup(
        `route:${callsign}`,
        async () => {
          const path =
            `${encodeURIComponent(callsign.slice(0, 2))}/` + `${encodeURIComponent(callsign)}.json`;
          return parseRoute(await fetchJson(`${routeRoot}/${path}`, request));
        },
        routeTtlMs,
      );
    },
  };
}

async function fetchJson(url, request) {
  const response = await request(url, { headers: { "user-agent": userAgent } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("ADSB.lol request failed");
  return response.json();
}

function parseRoute(route) {
  if (!route) return null;
  const codes = typeof route.airport_codes === "string" ? route.airport_codes.split("-") : [];
  const airports = route._airports ?? [];
  const origin = airportCode(airports?.[0]?.icao ?? codes[0]);
  const destination = airportCode(
    (airports.length > 1 ? airports.at(-1)?.icao : undefined) ??
      (codes.length > 1 ? codes.at(-1) : undefined),
  );
  if (!origin && !destination) return null;
  return { ...(origin ? { origin } : {}), ...(destination ? { destination } : {}) };
}

function normalize(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

function airportCode(value) {
  const code = normalize(value);
  return /^[A-Z0-9]{3,4}$/.test(code) ? code : null;
}
