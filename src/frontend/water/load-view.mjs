import { default as selectWaterTiles } from "./tile/coordinates.mjs";
import { default as selectWaterZoom } from "./tile/zoom.mjs";
import { default as createWaterTileMetadataLoader } from "./tile/metadata.mjs";

function createWaterViewSource(fetchRef) {
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
export default createWaterViewSource;
