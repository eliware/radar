const API_ROOT = "https://metar.vatsim.net/";
const CACHE_MS = 5 * 60 * 1000;
export { parseMetarStations } from "./stations.mjs";

export function createMetarLookup(stations, { fetchData = fetch, now = Date.now } = {}) {
  let cached;
  let expiresAt = 0;
  return {
    stations,
    async get() {
      if (!stations.length) return [];
      if (cached && now() < expiresAt) return cached;
      const response = await fetchData(`${API_ROOT}${stations.join(",")}?format=json`);
      if (!response.ok) throw new Error(`VATSIM METAR request failed: ${response.status}`);
      const reports = await response.json();
      if (!Array.isArray(reports)) throw new Error("VATSIM METAR response must be an array.");
      cached = reports.filter(
        (report) => stations.includes(report.id) && typeof report.metar === "string",
      );
      expiresAt = now() + CACHE_MS;
      return cached;
    },
  };
}
