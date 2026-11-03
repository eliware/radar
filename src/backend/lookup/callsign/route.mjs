import { hasUsefulCallsign } from "../../../shared/aircraft/callsign.mjs";
import { createRadarUserAgent } from "../../user-agent.mjs";
import { parseCallsignRouteResponse } from "./response.mjs";
import { buildCallsignRouteUrl } from "./route/url.mjs";

export function createCallsignRouteLookup(request, lookup, routeTtlMs) {
  return (value) => {
    const callsign = normalize(value);
    if (!hasUsefulCallsign(callsign)) return Promise.resolve(null);
    return lookup(
      `route:${callsign}`,
      async () => {
        const response = await request(buildCallsignRouteUrl(callsign), {
          headers: { "user-agent": createRadarUserAgent() },
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
