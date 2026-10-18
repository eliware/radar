import { MAX_RADAR_RANGE } from "../range.mjs";
import { createRadarReferenceCache } from "./cache.mjs";

const PATHS = ["airports", "navaids", "airspace-boundaries", "ils", "procedures", "airways"];
const RANGE_STEP_NM = 25;

export function createRadarReferenceLoader(fetchData, scene, location) {
  const cache = createRadarReferenceCache();
  let loadedThrough = 0;
  let requestedThrough = 0;
  let latestBounds = null;
  let lastKey = "";
  let timer;
  let loading;

  function loadNext() {
    const start = loadedThrough;
    const end = requestedThrough;
    requestedThrough = start;
    loading = fetchLayers(fetchData, start, end)
      .then((collections) => {
        cache.add(collections);
        loadedThrough = end;
        cache.apply(scene, latestBounds, location);
      })
      .catch(() => {})
      .finally(() => {
        loading = null;
        if (requestedThrough > loadedThrough)
          timer = setTimeout(() => ((timer = null), loadNext()), 180);
      });
  }

  return {
    load(view) {
      const bounds = view && typeof view === "object" ? view : null;
      const minimum = bounds?.minRangeNm ?? 0;
      const maximum = Math.min(MAX_RADAR_RANGE, bounds?.maxRangeNm ?? MAX_RADAR_RANGE);
      const key = bounds
        ? [bounds.minX, bounds.maxX, bounds.minZ, bounds.maxZ]
            .map((value) => Math.round(value * 2) / 2)
            .join(":")
        : "all";
      if (key === lastKey) return;
      lastKey = key;
      latestBounds = bounds;
      if (maximum <= minimum) return cache.clear(scene);
      if (loadedThrough) cache.apply(scene, bounds, location);
      const target = Math.min(MAX_RADAR_RANGE, Math.ceil(maximum / RANGE_STEP_NM) * RANGE_STEP_NM);
      if (target <= loadedThrough) return;
      requestedThrough = Math.max(requestedThrough, target);
      if (loading || timer) return;
      if (loadedThrough) timer = setTimeout(() => ((timer = null), loadNext()), 180);
      else loadNext();
    },
  };
}

async function fetchLayers(fetchData, minimum, maximum) {
  return Promise.all(
    PATHS.map(async (path) => {
      const response = await fetchData(`/api/${path}?minRangeNm=${minimum}&maxRangeNm=${maximum}`);
      if (!response.ok) throw new Error(`${path} request failed.`);
      return response.json();
    }),
  );
}
