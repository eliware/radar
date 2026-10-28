export function createLookupCacheEntries(maxEntries) {
  const entries = new Map();

  function set(key, entry) {
    entries.set(key, entry);
    if (entries.size > maxEntries) entries.delete(entries.keys().next().value);
  }

  return {
    get: (key) => entries.get(key),
    set,
    delete: (key) => entries.delete(key),
  };
}
