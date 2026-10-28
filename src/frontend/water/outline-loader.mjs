import { selectWaterTiles, selectWaterZoom } from "./tile/coordinates.mjs";
import { createWaterTileCache } from "./tile/cache.mjs";
import { createWaterTileMetadataLoader } from "./tile/metadata.mjs";

export function createWaterOutlineLoader(fetchRef = fetch) {
  let generation = 0;
  let requestedKeys = new Set();
  const cache = createWaterTileCache(fetchRef);
  const metadata = createWaterTileMetadataLoader(fetchRef);
  return {
    async load(center, rangeNm, onChange) {
      const current = ++generation;
      try {
        const tileJson = await metadata.load();
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
