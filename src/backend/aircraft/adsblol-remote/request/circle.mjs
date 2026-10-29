import { createAdsbLolRequestHeaders } from "./headers.mjs";
import { parseAdsbLolResponse } from "../response.mjs";

const API_ROOT = "https://re-api.adsb.lol/";

export async function requestAdsbLolCircle(request, location, radiusNm, apiKey) {
  const circle = `${location.latitude},${location.longitude},${radiusNm}`;
  const response = await request(`${API_ROOT}?circle=${circle}`, {
    headers: createAdsbLolRequestHeaders(apiKey),
  });
  if (!response.ok) throw new Error(`ADSB.lol re-api returned HTTP ${response.status}.`);
  return parseAdsbLolResponse(response);
}
