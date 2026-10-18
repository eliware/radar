import { MAX_RADAR_RANGE } from "../range.mjs";
import { intersectsViewport } from "./viewport.mjs";

const LAYERS = [
  ["airports", "updateAirports", 35],
  ["navaids", "updateNavaids", 1],
  ["airspace-boundaries", "updateBoundaries", 0],
  ["ils", "updateIls", 35],
  ["procedures", "updateProcedures", 35],
  ["airways", "updateAirways", 0],
];

export function createRadarReferenceLoader(fetchData, scene, location) {
  let lastKey = "";
  let timer;
  let generation = 0;
  return {
    load(view) {
      const bounds = view && typeof view === "object" ? view : null;
      const minimum = bounds?.minRangeNm ?? 0;
      const maximum = Math.min(MAX_RADAR_RANGE, bounds?.maxRangeNm ?? MAX_RADAR_RANGE);
      const key = bounds
        ? [bounds.minX, bounds.maxX, bounds.minZ, bounds.maxZ, minimum, maximum]
            .map((value) => Math.round(value * 2) / 2)
            .join(":")
        : "all";
      if (key === lastKey) return;
      const initial = lastKey === "";
      lastKey = key;
      if (maximum <= minimum) {
        LAYERS.forEach(([, update]) => scene[update]([]));
        return;
      }
      const request = ++generation;
      if (initial)
        return loadLayers(
          fetchData,
          scene,
          location,
          bounds,
          minimum,
          maximum,
          () => request === generation,
        );
      clearTimeout(timer);
      timer = setTimeout(
        () =>
          loadLayers(
            fetchData,
            scene,
            location,
            bounds,
            minimum,
            maximum,
            () => request === generation,
          ),
        180,
      );
    },
  };
}

async function loadLayers(fetchData, scene, location, bounds, minimum, maximum, current) {
  try {
    const collections = await Promise.all(
      LAYERS.map(([path]) =>
        fetchData(
          `/api/${path}?minRangeNm=${Math.floor(minimum)}&maxRangeNm=${Math.ceil(maximum)}`,
        ).then((response) => (response.ok ? response.json() : Promise.reject(new Error(path)))),
      ),
    );
    if (!current()) return;
    collections.forEach((items, index) => {
      const [, update, padding] = LAYERS[index];
      scene[update](
        bounds
          ? items.filter((item) => intersectsViewport(item, bounds, location, padding))
          : items,
      );
    });
  } catch {
    return;
  }
}
