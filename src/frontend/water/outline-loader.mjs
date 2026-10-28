import { selectWaterTiles, selectWaterZoom } from "./tile/coordinates.mjs";
import { createWaterTileCache } from "./tile/cache.mjs";

const TILE_JSON_URL = "https://tiles.openfreemap.org/planet";

export function createWaterOutlineLoader(fetchRef = fetch) {
  let tileJsonPromise;
  let generation = 0;
  let requestedKeys = new Set();
  const cache = createWaterTileCache(fetchRef);
  return {
    async load(center, rangeNm, onChange) {
      const current = ++generation;
      try {
        tileJsonPromise ??= getTileJson(fetchRef).catch((error) => {
          tileJsonPromise = null;
          throw error;
        });
        const tileJson = await tileJsonPromise;
        if (current !== generation) return;
        const zoom = selectWaterZoom(center.latitude, rangeNm);
        const tiles = selectWaterTiles(center, rangeNm, zoom);
        requestedKeys = new Set(tiles.map((tile) => tile.key));
        cache.retain(requestedKeys);
        const results = await Promise.all(
          tiles.map((tile) =>
            cache.load(tileJson, tile, () => requestedKeys.has(tile.key)).catch(() => false),
          ),
        );
        if (current === generation) onChange(cache.pathsFor(tiles), results.every(Boolean));
      } catch {
        if (current === generation) onChange([], false);
      }
    },
    cancel() {
      generation += 1;
    },
  };
}

async function getTileJson(fetchRef) {
  const response = await fetchRef(TILE_JSON_URL);
  if (!response.ok) throw new Error("Water tile metadata request failed.");
  return response.json();
}
