import { parseAdsbLolResponse } from "./response.mjs";
import { createAdsbLolHeaders } from "./headers.mjs";

const API_ROOT = "https://re-api.adsb.lol/";

export async function requestAdsbLolCircle(request, location, radiusNm, apiKey) {
  const circle = `${location.latitude},${location.longitude},${radiusNm}`;
  const response = await request(`${API_ROOT}?circle=${circle}`, {
    headers: createAdsbLolHeaders(apiKey),
  });
  if (!response.ok) throw new Error(`ADSB.lol re-api returned HTTP ${response.status}.`);
  return parseAdsbLolResponse(response);
}
