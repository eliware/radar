import { reconcileAircraftSource } from "./reconcile.mjs";

export function createMergedAircraftSourceState(entries) {
  function set(source, item) {
    if (typeof item?.icao !== "string" || !item.icao.trim()) return undefined;
    const icao = item.icao.trim().toUpperCase();
    const entry = entries.get(icao) ?? {};
    entry[source] = item;
    entries.set(icao, entry);
    return icao;
  }

  return {
    set,
    replace: (source, items) => reconcileAircraftSource(entries, source, items, set),
  };
}
