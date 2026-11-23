import { default as createMetarCache } from "./cache.mjs";
import { default as fetchMetarReports } from "./fetch.mjs";

function createMetarRequest(stations, { fetchData = fetch, now = Date.now } = {}) {
  const cache = createMetarCache({ now });
  return async function requestMetarReports() {
    const cached = cache.get();
    if (cached !== undefined) return cached;
    const filtered = await fetchMetarReports(stations, fetchData);
    cache.set(filtered);
    return filtered;
  };
}
export default createMetarRequest;
