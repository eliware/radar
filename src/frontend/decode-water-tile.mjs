import { VectorTile } from "@mapbox/vector-tile";
import { PbfReader } from "pbf";

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
      paths.push(...removeTileEdges(ring, tile, layer.extent));
    }
  }
  return paths;
}

function removeTileEdges(ring, tile, extent) {
  if (ring.length < 3) return [];
  const paths = [];
  let path = [];
  for (let index = 0; index < ring.length; index += 1) {
    const start = ring[index];
    const end = ring[(index + 1) % ring.length];
    if (isTileEdge(start, end, extent)) {
      if (path.length > 2) paths.push(path);
      path = [];
    } else {
      if (!path.length) path.push(tilePointToCoordinate(start, tile, extent));
      path.push(tilePointToCoordinate(end, tile, extent));
    }
  }
  if (path.length > 2) paths.push(path);
  return paths;
}

function isTileEdge(start, end, extent) {
  return (
    (start.x === end.x && (start.x === 0 || start.x === extent)) ||
    (start.y === end.y && (start.y === 0 || start.y === extent))
  );
}

function isCoastOrLake(value) {
  return value === "ocean" || value === "lake";
}

function tilePointToCoordinate(point, tile, extent) {
  const size = 2 ** tile.z;
  const x = (tile.x + point.x / extent) / size;
  const y = (tile.y + point.y / extent) / size;
  return {
    longitude: x * 360 - 180,
    latitude: (Math.atan(Math.sinh(Math.PI * (1 - 2 * y))) * 180) / Math.PI,
  };
}
