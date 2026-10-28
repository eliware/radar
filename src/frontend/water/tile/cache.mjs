import { decodeWaterTile } from "../../decode-water-tile.mjs";
import { createWaterTileRequest } from "./request.mjs";

export function createWaterTileCache(fetchRef) {
  const cache = new Map();
  const request = createWaterTileRequest(fetchRef);

  function retain(keys) {
    request.retain(keys);
  }

  function load(tileJson, tile, isRequested) {
    if (cache.has(tile.key)) return Promise.resolve(true);
    return request.load(tileJson, tile, isRequested).then((buffer) => {
      if (buffer === null) return false;
      cache.set(tile.key, decodeWaterTile(buffer, tile));
      if (cache.size > 96) cache.delete(cache.keys().next().value);
      return true;
    });
  }

  function pathsFor(tiles) {
    return tiles.flatMap((tile) => cache.get(tile.key) ?? []);
  }

  return { load, retain, pathsFor };
}
