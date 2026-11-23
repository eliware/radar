import { default as createWaterTileCache } from "./tile/cache.mjs";
import { default as createWaterViewLoader } from "./view-loader.mjs";
import { default as createWaterViewSource } from "./load-view.mjs";

function createWaterOutlineLoader(fetchRef = fetch) {
  const cache = createWaterTileCache(fetchRef);
  const source = createWaterViewSource(fetchRef);
  return createWaterViewLoader({
    loadView: (center, rangeNm) => source.load(center, rangeNm),
    cache,
  });
}
export default createWaterOutlineLoader;
