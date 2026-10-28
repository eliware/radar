import { decodeWaterTile } from "../../decode-water-tile.mjs";

export function createWaterTileCache(fetchRef) {
  const cache = new Map();
  const pending = new Map();

  function retain(keys) {
    for (const [key, request] of pending) {
      if (keys.has(key)) continue;
      request.controller.abort();
      pending.delete(key);
    }
  }

  function load(tileJson, tile, isRequested) {
    if (cache.has(tile.key)) return Promise.resolve(true);
    if (pending.has(tile.key)) return pending.get(tile.key).promise;
    const entry = { controller: new AbortController() };
    entry.promise = fetchTile(
      fetchRef,
      tileJson,
      tile,
      cache,
      entry.controller,
      isRequested,
    ).finally(() => {
      if (pending.get(tile.key) === entry) pending.delete(tile.key);
    });
    pending.set(tile.key, entry);
    return entry.promise;
  }

  function pathsFor(tiles) {
    return tiles.flatMap((tile) => cache.get(tile.key) ?? []);
  }

  return { load, retain, pathsFor };
}

async function fetchTile(fetchRef, tileJson, tile, cache, controller, isRequested) {
  const template = tileJson.tiles?.[0];
  if (!template) return false;
  const response = await fetchRef(
    template.replace("{z}", tile.z).replace("{x}", tile.x).replace("{y}", tile.y),
    { signal: controller.signal },
  );
  if (!response.ok || !isRequested()) return false;
  cache.set(tile.key, decodeWaterTile(await response.arrayBuffer(), tile));
  if (cache.size > 96) cache.delete(cache.keys().next().value);
  return true;
}
