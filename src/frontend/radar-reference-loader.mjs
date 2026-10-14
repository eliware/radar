import { MAX_RADAR_RANGE } from "./radar-range.mjs";

export function createRadarReferenceLoader(fetchData, scene) {
  let loadedThrough = 0;
  let requestedThrough = 0;
  let loading;
  async function loadNextRanges() {
    while (loadedThrough < requestedThrough) {
      const start = loadedThrough;
      const end = requestedThrough;
      const paths = [
        "/api/airports",
        "/api/navaids",
        "/api/airspace-boundaries",
        "/api/ils",
        "/api/procedures",
      ];
      const updates = [
        scene.updateAirports,
        scene.updateNavaids,
        scene.updateBoundaries,
        scene.updateIls,
        scene.updateProcedures,
      ];
      try {
        const collections = await Promise.all(
          paths.map((path) => loadCollection(fetchData, path, start, end)),
        );
        collections.forEach((items, index) => updates[index](items));
        loadedThrough = end;
      } catch (error) {
        if (requestedThrough <= end) throw error;
      }
    }
  }
  return {
    load(range) {
      if (!Number.isFinite(range)) return Promise.resolve();
      requestedThrough = Math.max(requestedThrough, Math.min(MAX_RADAR_RANGE, range));
      if (!loading && loadedThrough < requestedThrough) {
        loading = loadNextRanges()
          .catch(() => undefined)
          .finally(() => (loading = null));
      }
      return loading ?? Promise.resolve();
    },
    loadedThrough: () => loadedThrough,
  };
}

async function loadCollection(fetchData, path, start, end) {
  const response = await fetchData(`${path}?minRangeNm=${start}&maxRangeNm=${end}`);
  if (!response.ok) throw new Error(`${path} request failed.`);
  return response.json();
}
