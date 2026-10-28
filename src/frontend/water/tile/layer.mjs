import { clipWaterTileRing } from "../../clip/water-tile-ring.mjs";

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
