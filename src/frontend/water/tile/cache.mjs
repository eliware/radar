import { decodeWaterTile } from "./decoder.mjs";
import { createWaterTileRequest } from "./request.mjs";
import { createWaterTileStore } from "./store.mjs";

export function createWaterTileCache(fetchRef) {
  const cache = createWaterTileStore();
  const request = createWaterTileRequest(fetchRef);

  function retain(keys) {
    request.retain(keys);
  }

  function load(tileJson, tile, isRequested) {
    if (cache.has(tile.key)) return Promise.resolve(true);
    return request.load(tileJson, tile, isRequested).then((buffer) => {
      if (buffer === null) return false;
      cache.set(tile.key, decodeWaterTile(buffer, tile));
      return true;
    });
  }

  function pathsFor(tiles) {
    return cache.pathsFor(tiles);
  }

  return { load, retain, pathsFor };
}
