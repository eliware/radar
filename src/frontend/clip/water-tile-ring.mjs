import { tilePointToCoordinate } from "./tile-coordinate.mjs";

export function clipWaterTileRing(ring, tile, extent) {
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
    (start.x === end.x && (start.x <= 0 || start.x >= extent)) ||
    (start.y === end.y && (start.y <= 0 || start.y >= extent))
  );
}
