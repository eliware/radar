import { normalizeRemoteAircraft } from "./normalize.mjs";
import { preserveRouteData } from "./route/data.mjs";

const AIRCRAFT_MAX_AGE_MS = 120_000;

export function createAdsbLolTrackStore({ location, clock = Date.now }) {
  const aircraft = new Map();

  function list() {
    const now = clock();
    for (const [icao, item] of aircraft) {
      if (now - item.lastSeen > AIRCRAFT_MAX_AGE_MS) aircraft.delete(icao);
    }
    return [...aircraft.values()];
  }

  function update(record) {
    const mapped = normalizeRemoteAircraft(record, location, clock());
    if (!mapped) return null;
    const previous = aircraft.get(mapped.icao);
    aircraft.set(mapped.icao, { ...preserveRouteData(mapped, previous), ...mapped });
    return mapped;
  }

  return {
    list,
    update,
    get: (icao) => aircraft.get(icao),
    set: (icao, item) => aircraft.set(icao, item),
    clear: () => aircraft.clear(),
  };
}
