import { VectorTile } from "@mapbox/vector-tile";
import { PbfReader } from "pbf";
import { decodeWaterLayer } from "./layer.mjs";

export function decodeWaterTile(buffer, tile) {
  const vectorTile = new VectorTile(new PbfReader(buffer));
  const layer = vectorTile.layers.water;
  if (!layer) return [];
  return decodeWaterLayer(layer, tile);
}
