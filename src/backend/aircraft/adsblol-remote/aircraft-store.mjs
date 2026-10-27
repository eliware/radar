import { normalizeRemoteAircraft } from "../remote-aircraft.mjs";

const AIRCRAFT_MAX_AGE_MS = 120_000;

export function createAdsbLolAircraftStore({
  location,
  lookup,
  clock = Date.now,
  onRouteUpdate = () => {},
}) {
  const aircraft = new Map();
  let routeLookupsEnabled = true;

  function list() {
    const now = clock();
    for (const [icao, item] of aircraft) {
      if (now - item.lastSeen > AIRCRAFT_MAX_AGE_MS) aircraft.delete(icao);
    }
    return [...aircraft.values()];
  }

  function update(record) {
    const mapped = normalizeRemoteAircraft(record, location, clock());
    if (!mapped) return;
    const previous = aircraft.get(mapped.icao);
    const route = previous?.callsign === mapped.callsign ? previous : {};
    const stored = { ...route, ...mapped };
    aircraft.set(mapped.icao, stored);
    if (
      !routeLookupsEnabled ||
      !lookup ||
      !mapped.callsign ||
      (stored.origin && stored.destination)
    )
      return;
    lookup
      .getCallsignRoute(mapped.callsign)
      .then((result) => {
        if (result && aircraft.get(mapped.icao)?.callsign === mapped.callsign) {
          aircraft.set(mapped.icao, { ...aircraft.get(mapped.icao), ...result });
          onRouteUpdate();
        }
      })
      .catch(() => {});
  }

  return {
    list,
    update,
    clear: () => aircraft.clear(),
    setRouteLookupsEnabled: (value) => {
      routeLookupsEnabled = Boolean(value);
    },
  };
}
