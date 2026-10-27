import { compareAircraftDistance, mergeAircraftRecord } from "./merge.mjs";

const LOCAL_FRESHNESS_MS = 8000;

export function createMergedAircraftState({
  clock = Date.now,
  localFreshnessMs = LOCAL_FRESHNESS_MS,
} = {}) {
  const entries = new Map();
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
    list() {
      const now = clock();
      return [...entries.values()]
        .map((entry) => mergeAircraftRecord(entry, now, localFreshnessMs))
        .sort(compareAircraftDistance);
    },
    localFurthestDistanceNm() {
      return Math.max(
        0,
        ...[...entries.values()]
          .map(({ local }) => local?.distanceNauticalMiles)
          .filter(Number.isFinite),
      );
    },
  };
}
