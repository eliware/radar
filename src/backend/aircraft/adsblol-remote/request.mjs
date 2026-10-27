const API_ROOT = "https://re-api.adsb.lol/";
const USER_AGENT = "EliwareRadar/15.0.1 (+https://radar.purinton.us; contact: radar@eliware.org)";

export async function requestAdsbLolCircle(
  request,
  location,
  radiusNm,
  apiKey = process.env.ADSBLOL_API_KEY,
) {
  const circle = `${location.latitude},${location.longitude},${radiusNm}`;
  const headers = { "user-agent": USER_AGENT };
  if (apiKey) headers["x-api-key"] = apiKey;
  const response = await request(`${API_ROOT}?circle=${circle}`, {
    headers,
  });
  if (!response.ok) throw new Error(`ADSB.lol re-api returned HTTP ${response.status}.`);
  const body = await response.json();
  return Array.isArray(body?.aircraft) ? body.aircraft : [];
}
