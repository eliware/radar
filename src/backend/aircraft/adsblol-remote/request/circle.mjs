import { default as createAdsbLolRequestHeaders } from "./headers.mjs";
import { default as parseAdsbLolRetryAfter } from "./retry-after.mjs";
import { default as parseAdsbLolResponse } from "../response.mjs";

const API_ROOT = "https://re-api.adsb.lol/";

async function requestAdsbLolCircle(request, location, radiusNm, apiKey, onRequest = () => {}) {
  const circle = `${location.latitude},${location.longitude},${radiusNm}`;
  const options = { headers: createAdsbLolRequestHeaders(apiKey) };
  onRequest({ radiusNm, apiKeyHeaderPresent: Boolean(options.headers["x-api-key"]) });
  const response = await request(`${API_ROOT}?circle=${circle}`, options);
  if (!response.ok) {
    const error = new Error(`ADSB.lol re-api returned HTTP ${response.status}.`);
    const retryAfterMs = parseAdsbLolRetryAfter(response.headers?.get?.("retry-after"));
    if (retryAfterMs !== undefined) error.retryAfterMs = retryAfterMs;
    throw error;
  }
  return parseAdsbLolResponse(response);
}
export default requestAdsbLolCircle;
