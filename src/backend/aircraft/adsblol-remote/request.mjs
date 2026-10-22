const API_ROOT = "https://re-api.adsb.lol/";
const USER_AGENT = "EliwareRadar/15.0.0 (+https://radar.purinton.us; contact: radar@eliware.org)";

export async function requestAdsbLolCircle(request, location, radiusNm) {
  const circle = `${location.latitude},${location.longitude},${radiusNm}`;
  const response = await request(`${API_ROOT}?circle=${circle}`, {
    headers: { "user-agent": USER_AGENT },
  });
  if (!response.ok) throw new Error(`ADSB.lol re-api returned HTTP ${response.status}.`);
  const body = await response.json();
  return Array.isArray(body?.aircraft) ? body.aircraft : [];
}
