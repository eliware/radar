import { default as createMetarRequest } from "./request.mjs";
export { default as parseMetarStations } from "./stations.mjs";

function createMetarLookup(stations, { fetchData = fetch, now = Date.now } = {}) {
  const request = createMetarRequest(stations, { fetchData, now });
  return {
    stations,
    async get() {
      if (!stations.length) return [];
      return request();
    },
  };
}
export default createMetarLookup;
