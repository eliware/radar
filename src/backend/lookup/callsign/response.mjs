import { parseRoute } from "./route/data.mjs";

export async function parseCallsignRouteResponse(response) {
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("ADSB.lol request failed");
  return parseRoute(await response.json());
}
