const routeRoot = "https://vrs-standing-data.adsb.lol/routes";

export function buildCallsignRouteUrl(callsign) {
  const path =
    `${encodeURIComponent(callsign.slice(0, 2))}/` + `${encodeURIComponent(callsign)}.json`;
  return `${routeRoot}/${path}`;
}

export function parseRoute(route) {
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

function airportCode(value) {
  const code = typeof value === "string" ? value.trim().toUpperCase() : "";
  return /^[A-Z0-9]{3,4}$/.test(code) ? code : null;
}
