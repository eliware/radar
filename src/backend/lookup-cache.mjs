import { createLookupCacheEntries } from "./lookup-cache/entries.mjs";

export function createLookupCache({ clock = Date.now, maxEntries = 256 } = {}) {
  const entries = createLookupCacheEntries(maxEntries);

  function lookup(key, load, { successTtlMs, missingTtlMs, failureTtlMs }) {
    const cached = entries.get(key);
    if (cached?.promise) return cached.promise;
    if (cached && cached.expiresAt > clock()) return Promise.resolve(cached.value);
    entries.delete(key);
    const entry = { expiresAt: Infinity, promise: null, value: null };
    entry.promise = Promise.resolve()
      .then(load)
      .then((value) => save(entry, value, value === null ? missingTtlMs : successTtlMs))
      .catch(() => save(entry, null, failureTtlMs));
    entries.set(key, entry);
    return entry.promise;
  }

  function save(entry, value, ttl) {
    entry.value = value;
    entry.expiresAt = clock() + ttl;
    entry.promise = null;
    return value;
  }

  return { lookup };
}
