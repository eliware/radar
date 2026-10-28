import { createMetarRequest } from "./request.mjs";
export { parseMetarStations } from "./stations.mjs";

export function createMetarLookup(stations, { fetchData = fetch, now = Date.now } = {}) {
  const request = createMetarRequest(stations, { fetchData, now });
  return {
    stations,
    async get() {
      if (!stations.length) return [];
      return request();
    },
  };
}
