import { createMetarCache } from "./cache.mjs";
import { fetchMetarReports } from "./fetch.mjs";

export function createMetarRequest(stations, { fetchData = fetch, now = Date.now } = {}) {
  const cache = createMetarCache({ now });
  return async function requestMetarReports() {
    const cached = cache.get();
    if (cached !== undefined) return cached;
    const filtered = await fetchMetarReports(stations, fetchData);
    cache.set(filtered);
    return filtered;
  };
}
