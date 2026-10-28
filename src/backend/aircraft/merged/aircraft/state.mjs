import { createMergedAircraftList } from "./list.mjs";

export function createMergedAircraftState({ clock = Date.now, localFreshnessMs = 8000 } = {}) {
  const entries = new Map();
  const aircraftList = createMergedAircraftList(entries, clock, localFreshnessMs);
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
      if (typeof item?.icao === "string" && item.icao.trim())
        current.add(item.icao.trim().toUpperCase());
    }
    for (const [icao, entry] of entries) {
      if (!current.has(icao)) delete entry[source];
      if (!entry.local && !entry.remote) entries.delete(icao);
    }
  }
  return {
    setLocal: (item) => set("local", item),
    replaceLocal: (items) => replace("local", items),
    replaceRemote: (items) => replace("remote", items),
    ...aircraftList,
  };
}
