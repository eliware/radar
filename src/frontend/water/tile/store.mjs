export function createWaterTileStore(maxEntries = 96) {
  const entries = new Map();

  function set(key, paths) {
    entries.set(key, paths);
    if (entries.size > maxEntries) entries.delete(entries.keys().next().value);
  }

  function pathsFor(tiles) {
    return tiles.flatMap((tile) => entries.get(tile.key) ?? []);
  }

  return {
    has: (key) => entries.has(key),
    get: (key) => entries.get(key),
    set,
    pathsFor,
    get size() {
      return entries.size;
    },
  };
}
