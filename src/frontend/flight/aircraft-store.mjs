import { classifyFlightAircraftNearHome } from "./near-home.mjs";
import { pruneExpiredFlightAircraft } from "./expiry.mjs";

export function createFlightStripAircraftStore(clock = Date.now) {
  const aircraft = new Map();
  return {
    update(items) {
      for (const item of Array.isArray(items) ? items : [items])
        if (item?.icao) aircraft.set(item.icao, item);
    },
    updateRemote(items) {
      const remoteIds = new Set(items.filter((item) => item.remoteOnly).map((item) => item.icao));
      for (const [icao, item] of aircraft)
        if (item.remoteOnly && !remoteIds.has(icao)) aircraft.delete(icao);
      for (const item of items) aircraft.set(item.icao, item);
    },
    replace(items) {
      aircraft.clear();
      for (const item of Array.isArray(items) ? items : [])
        if (item?.icao) aircraft.set(item.icao, item);
    },
    list(location, elevationFeet, now = clock()) {
      pruneExpiredFlightAircraft(aircraft, now);
      return classifyFlightAircraftNearHome(aircraft.values(), location, elevationFeet);
    },
  };
}
