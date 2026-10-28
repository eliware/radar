import { VectorTile } from "@mapbox/vector-tile";
import { PbfReader } from "pbf";
import { decodeWaterLayer } from "./layer.mjs";
import { selectWaterTileLayer } from "./layer-selection.mjs";

export function decodeWaterTile(buffer, tile) {
  const vectorTile = new VectorTile(new PbfReader(buffer));
  const layer = selectWaterTileLayer(vectorTile);
  if (!layer) return [];
  return decodeWaterLayer(layer, tile);
}
