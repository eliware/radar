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
        .map((entry) => merge(entry, now, localFreshnessMs))
        .sort(byDistance);
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

function merge({ local, remote }, now, localFreshnessMs) {
  if (!local) return { ...remote, remoteOnly: true };
  const localIsFresh = !Number.isFinite(local.lastSeen) || now - local.lastSeen <= localFreshnessMs;
  const useNewerRemote =
    !localIsFresh && Number.isFinite(remote?.lastSeen) && remote.lastSeen > local.lastSeen;
  const primary = useNewerRemote ? remote : local;
  const fallback = useNewerRemote ? local : remote;
  const combined = { ...fallback, ...primary };
  for (const [key, value] of Object.entries(fallback ?? {})) {
    if (key === "remoteOnly") continue;
    if (primary[key] === null || primary[key] === undefined || primary[key] === "")
      combined[key] = value;
  }
  combined.remoteOnly = false;
  return combined;
}

function byDistance(left, right) {
  return (left.distanceNauticalMiles ?? Infinity) - (right.distanceNauticalMiles ?? Infinity);
}
