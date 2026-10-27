import { MAX_RADAR_RANGE } from "../range.mjs";
import { createRadarReferenceCache } from "./cache.mjs";
import { createRadarReferenceRequestScheduler } from "./request-scheduler.mjs";
import { createRadarReferenceViewApplier } from "./view-applier.mjs";

const PATHS = ["airports", "navaids", "airspace-boundaries", "ils", "procedures", "airways"];
const RANGE_STEP_NM = 25;

export function createRadarReferenceLoader(fetchData, scene, location) {
  const cache = createRadarReferenceCache();
  let latestBounds = null;
  let lastKey = "";
  const applier = createRadarReferenceViewApplier(cache, scene, location);
  const scheduler = createRadarReferenceRequestScheduler(
    (minimum, maximum) => fetchLayers(fetchData, minimum, maximum),
    (collections) => (cache.add(collections), applyLatest()),
  );

  function applyLatest() {
    applier.schedule(latestBounds);
  }

  return {
    load(view) {
      const bounds = view && typeof view === "object" ? view : null;
      if (!bounds) {
        lastKey = "";
        latestBounds = null;
        applier.cancel();
        return cache.clear(scene);
      }
      const minimum = bounds.minRangeNm ?? 0;
      const maximum = Math.min(MAX_RADAR_RANGE, bounds.maxRangeNm ?? 0);
      const key = [bounds.minX, bounds.maxX, bounds.minZ, bounds.maxZ, minimum, maximum]
        .map((value) => Math.round(value * 2) / 2)
        .join(":");
      if (key === lastKey) return;
      lastKey = key;
      latestBounds = bounds;
      if (maximum <= minimum) {
        applier.cancel();
        return cache.clear(scene);
      }
      if (scheduler.loadedThrough) applyLatest();
      const target = Math.min(MAX_RADAR_RANGE, Math.ceil(maximum / RANGE_STEP_NM) * RANGE_STEP_NM);
      if (target <= scheduler.loadedThrough) return;
      scheduler.request(target);
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
