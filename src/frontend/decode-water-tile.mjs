import { VectorTile } from "@mapbox/vector-tile";
import { PbfReader } from "pbf";
import { decodeWaterLayer } from "./water/tile/decoder.mjs";

export { decodeWaterLayer };

export function decodeWaterTile(buffer, tile) {
  const vectorTile = new VectorTile(new PbfReader(buffer));
  const layer = vectorTile.layers.water;
  if (!layer) return [];
  return decodeWaterLayer(layer, tile);
}
