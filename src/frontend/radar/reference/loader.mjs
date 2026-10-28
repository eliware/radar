import { MAX_RADAR_RANGE } from "../range.mjs";
import { createRadarReferenceCacheSession } from "./cache-session.mjs";
import { createRadarReferenceRequestScheduler } from "./request-scheduler.mjs";

const PATHS = ["airports", "navaids", "airspace-boundaries", "ils", "procedures", "airways"];
const RANGE_STEP_NM = 25;

export function createRadarReferenceLoader(fetchData, scene, location) {
  const session = createRadarReferenceCacheSession(scene, location);
  let lastKey = "";
  const scheduler = createRadarReferenceRequestScheduler(
    (minimum, maximum) => fetchLayers(fetchData, minimum, maximum),
    (collections) => session.add(collections),
  );

  return {
    load(view) {
      const bounds = view && typeof view === "object" ? view : null;
      if (!bounds) {
        lastKey = "";
        return session.clear();
      }
      const minimum = bounds.minRangeNm ?? 0;
      const maximum = Math.min(MAX_RADAR_RANGE, bounds.maxRangeNm ?? 0);
      const key = [bounds.minX, bounds.maxX, bounds.minZ, bounds.maxZ, minimum, maximum]
        .map((value) => Math.round(value * 2) / 2)
        .join(":");
      if (key === lastKey) return;
      lastKey = key;
      session.setBounds(bounds);
      if (maximum <= minimum) {
        return session.clear();
      }
      if (scheduler.loadedThrough) session.applyLatest();
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
