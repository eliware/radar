import { default as parseRoute } from "./route/data.mjs";

async function parseCallsignRouteResponse(response) {
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("ADSB.lol request failed");
  return parseRoute(await response.json());
}
export default parseCallsignRouteResponse;
