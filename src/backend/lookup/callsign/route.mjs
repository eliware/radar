import { hasUsefulCallsign } from "../../../shared/aircraft/callsign.mjs";
import { parseRoute } from "./response.mjs";

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

function normalize(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}
