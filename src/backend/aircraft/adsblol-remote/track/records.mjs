const AIRCRAFT_MAX_AGE_MS = 120_000;

export function createAdsbLolTrackRecords({ clock = Date.now } = {}) {
  const records = new Map();
  function list() {
    const now = clock();
    for (const [icao, item] of records) {
      if (now - item.lastSeen > AIRCRAFT_MAX_AGE_MS) records.delete(icao);
    }
    return [...records.values()];
  }

  return {
    list,
    get: (icao) => records.get(icao),
    set: (icao, item) => records.set(icao, item),
    clear: () => records.clear(),
  };
}
