import { hasUsefulCallsign } from "../../shared/aircraft/callsign.mjs";

const routeRoot = "https://vrs-standing-data.adsb.lol/routes";
const userAgent = "EliwareRadar/15.0.1 (+https://radar.purinton.us; contact: radar@eliware.org)";

export function createCallsignRouteLookup(request, lookup, routeTtlMs) {
  return (value) => {
    const callsign = normalize(value);
    if (!hasUsefulCallsign(callsign)) return Promise.resolve(null);
    return lookup(
      `route:${callsign}`,
      async () => {
        const path =
          `${encodeURIComponent(callsign.slice(0, 2))}/` + `${encodeURIComponent(callsign)}.json`;
        const response = await request(`${routeRoot}/${path}`, {
          headers: { "user-agent": userAgent },
        });
        if (response.status === 404) return null;
        if (!response.ok) throw new Error("ADSB.lol request failed");
        return parseRoute(await response.json());
      },
      routeTtlMs,
    );
  };
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
