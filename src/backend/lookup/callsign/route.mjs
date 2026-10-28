import { hasUsefulCallsign } from "../../../shared/aircraft/callsign.mjs";
import { parseCallsignRouteResponse } from "./response.mjs";
import { buildCallsignRouteUrl } from "./route/data.mjs";

const userAgent = "EliwareRadar/15.0.1 (+https://radar.purinton.us; contact: radar@eliware.org)";

export function createCallsignRouteLookup(request, lookup, routeTtlMs) {
  return (value) => {
    const callsign = normalize(value);
    if (!hasUsefulCallsign(callsign)) return Promise.resolve(null);
    return lookup(
      `route:${callsign}`,
      async () => {
        const response = await request(buildCallsignRouteUrl(callsign), {
          headers: { "user-agent": userAgent },
        });
        return parseCallsignRouteResponse(response);
      },
      routeTtlMs,
    );
  };
}

function normalize(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}
