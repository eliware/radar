import { default as hasUsefulCallsign } from "../../../shared/aircraft/callsign.mjs";
import { default as createRadarUserAgent } from "../../user-agent.mjs";
import { default as parseCallsignRouteResponse } from "./response.mjs";
import { default as buildCallsignRouteUrl } from "./route/url.mjs";

function createCallsignRouteLookup(request, lookup, routeTtlMs) {
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
export default createCallsignRouteLookup;
