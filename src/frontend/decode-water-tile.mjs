import { VectorTile } from "@mapbox/vector-tile";
import { PbfReader } from "pbf";
import { clipWaterTileRing } from "./clip-water-tile-ring.mjs";

export function decodeWaterTile(buffer, tile) {
  const vectorTile = new VectorTile(new PbfReader(buffer));
  const layer = vectorTile.layers.water;
  if (!layer) return [];
  return decodeWaterLayer(layer, tile);
}

export function decodeWaterLayer(layer, tile) {
  const paths = [];
  for (let index = 0; index < layer.length; index += 1) {
    const feature = layer.feature(index);
    if (!isCoastOrLake(feature.properties.class)) continue;
    for (const ring of feature.loadGeometry()) {
      paths.push(...clipWaterTileRing(ring, tile, layer.extent));
    }
  }
  return paths;
}

function isCoastOrLake(value) {
  return value === "ocean" || value === "lake";
}
