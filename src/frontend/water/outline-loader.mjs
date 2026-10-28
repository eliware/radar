import { selectWaterTiles, selectWaterZoom } from "./tile/coordinates.mjs";
import { createWaterTileCache } from "./tile/cache.mjs";
import { createWaterTileMetadataLoader } from "./tile/metadata.mjs";
import { createWaterViewLoader } from "./view-loader.mjs";

export function createWaterOutlineLoader(fetchRef = fetch) {
  const cache = createWaterTileCache(fetchRef);
  const metadata = createWaterTileMetadataLoader(fetchRef);
  return createWaterViewLoader({
    loadMetadata: () => metadata.load(),
    selectTiles: (center, rangeNm) =>
      selectWaterTiles(center, rangeNm, selectWaterZoom(center.latitude, rangeNm)),
    cache,
  });
}
