import { normalizeRemoteAircraft } from "../normalize.mjs";
import { preserveRouteData } from "../route/data.mjs";
import { createAdsbLolTrackRecords } from "./records.mjs";

export function createAdsbLolTrackStore({ location, clock = Date.now }) {
  const aircraft = createAdsbLolTrackRecords({ clock });

  function update(record) {
    const mapped = normalizeRemoteAircraft(record, location, clock());
    if (!mapped) return null;
    const previous = aircraft.get(mapped.icao);
    aircraft.set(mapped.icao, { ...preserveRouteData(mapped, previous), ...mapped });
    return mapped;
  }

  return {
    list: aircraft.list,
    update,
    get: aircraft.get,
    set: aircraft.set,
    clear: aircraft.clear,
  };
}
