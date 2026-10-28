import { createMetarCache } from "./cache.mjs";

const API_ROOT = "https://metar.vatsim.net/";

export function createMetarRequest(stations, { fetchData = fetch, now = Date.now } = {}) {
  const cache = createMetarCache({ now });
  return async function requestMetarReports() {
    const cached = cache.get();
    if (cached !== undefined) return cached;
    const response = await fetchData(`${API_ROOT}${stations.join(",")}?format=json`);
    if (!response.ok) throw new Error(`VATSIM METAR request failed: ${response.status}`);
    const reports = await response.json();
    if (!Array.isArray(reports)) throw new Error("VATSIM METAR response must be an array.");
    const filtered = reports.filter(
      (report) => stations.includes(report.id) && typeof report.metar === "string",
    );
    cache.set(filtered);
    return filtered;
  };
}
