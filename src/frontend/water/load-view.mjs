import { selectWaterTiles } from "./tile/coordinates.mjs";
import { selectWaterZoom } from "./tile/zoom.mjs";
import { createWaterTileMetadataLoader } from "./tile/metadata.mjs";

export function createWaterViewSource(fetchRef) {
  const metadata = createWaterTileMetadataLoader(fetchRef);
  return {
    async load(center, rangeNm) {
      const tileJson = await metadata.load();
      const zoom = selectWaterZoom(center.latitude, rangeNm);
      return {
        tileJson,
        tiles: selectWaterTiles(center, rangeNm, zoom),
      };
    },
  };
}
