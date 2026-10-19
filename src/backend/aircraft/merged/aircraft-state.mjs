export function createMergedAircraftState() {
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
      return [...entries.values()].map(merge).sort(byDistance);
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

function merge({ local, remote }) {
  if (!local) return { ...remote, remoteOnly: true };
  const combined = { ...remote, ...local, remoteOnly: false };
  for (const [key, value] of Object.entries(remote ?? {}))
    if (local[key] === null || local[key] === undefined || local[key] === "") combined[key] = value;
  return combined;
}

function byDistance(left, right) {
  return (left.distanceNauticalMiles ?? Infinity) - (right.distanceNauticalMiles ?? Infinity);
}
