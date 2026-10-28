import { createWaterTileCache } from "./tile/cache.mjs";
import { createWaterViewLoader } from "./view-loader.mjs";
import { createWaterViewSource } from "./load-view.mjs";

export function createWaterOutlineLoader(fetchRef = fetch) {
  const cache = createWaterTileCache(fetchRef);
  const source = createWaterViewSource(fetchRef);
  return createWaterViewLoader({
    loadView: (center, rangeNm) => source.load(center, rangeNm),
    cache,
  });
}
