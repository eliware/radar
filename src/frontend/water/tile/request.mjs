import { createWaterTileUrl } from "./url.mjs";

export function createWaterTileRequest(fetchRef) {
  const pending = new Map();

  function retain(keys) {
    for (const [key, request] of pending) {
      if (keys.has(key)) continue;
      request.controller.abort();
      pending.delete(key);
    }
  }

  function load(tileJson, tile, isRequested) {
    if (pending.has(tile.key)) return pending.get(tile.key).promise;
    const url = createWaterTileUrl(tileJson, tile);
    if (!url) return Promise.resolve(null);
    const entry = { controller: new AbortController() };
    entry.promise = fetchRef(url, { signal: entry.controller.signal })
      .then(async (response) => {
        if (!response.ok || !isRequested()) return null;
        return response.arrayBuffer();
      })
      .finally(() => {
        if (pending.get(tile.key) === entry) pending.delete(tile.key);
      });
    pending.set(tile.key, entry);
    return entry.promise;
  }

  return { load, retain };
}
