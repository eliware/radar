export function createMergedAircraftSourceState(entries) {
  function set(source, item) {
    if (typeof item?.icao !== "string" || !item.icao.trim()) return;
    const icao = item.icao.trim().toUpperCase();
    const entry = entries.get(icao) ?? {};
    entry[source] = item;
    entries.set(icao, entry);
  }

  function replace(source, items) {
    const current = new Set();
    for (const item of items) {
      set(source, item);
      if (typeof item?.icao === "string" && item.icao.trim()) {
        current.add(item.icao.trim().toUpperCase());
      }
    }
    for (const [icao, entry] of entries) {
      if (!current.has(icao)) delete entry[source];
      if (!entry.local && !entry.remote) entries.delete(icao);
    }
  }

  return { set, replace };
}
