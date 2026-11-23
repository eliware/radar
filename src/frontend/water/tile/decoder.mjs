import { VectorTile } from "@mapbox/vector-tile";
import { PbfReader } from "pbf";
import { default as decodeWaterLayer } from "./layer.mjs";
import { default as selectWaterTileLayer } from "./layer-selection.mjs";

function decodeWaterTile(buffer, tile) {
  const vectorTile = new VectorTile(new PbfReader(buffer));
  const layer = selectWaterTileLayer(vectorTile);
  if (!layer) return [];
  return decodeWaterLayer(layer, tile);
}
export default decodeWaterTile;
