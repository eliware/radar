import { createAdsbLolRequestHeaders } from "./headers.mjs";
import { parseAdsbLolResponse } from "../response.mjs";

const API_ROOT = "https://re-api.adsb.lol/";

export async function requestAdsbLolCircle(
  request,
  location,
  radiusNm,
  apiKey,
  onRequest = () => {},
) {
  const circle = `${location.latitude},${location.longitude},${radiusNm}`;
  const options = { headers: createAdsbLolRequestHeaders(apiKey) };
  onRequest({ radiusNm, apiKeyHeaderPresent: Boolean(options.headers["x-api-key"]) });
  const response = await request(`${API_ROOT}?circle=${circle}`, options);
  if (!response.ok) throw new Error(`ADSB.lol re-api returned HTTP ${response.status}.`);
  return parseAdsbLolResponse(response);
}
