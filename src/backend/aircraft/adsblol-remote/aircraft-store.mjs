import { normalizeRemoteAircraft } from "./normalize.mjs";
import { createAdsbLolRouteEnrichment } from "./route/enrichment.mjs";
import { preserveRouteData } from "./route/data.mjs";

const AIRCRAFT_MAX_AGE_MS = 120_000;

export function createAdsbLolAircraftStore({
  location,
  lookup,
  clock = Date.now,
  onRouteUpdate = () => {},
}) {
  const aircraft = new Map();
  const routes = createAdsbLolRouteEnrichment({ lookup, onRouteUpdate });

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
    const stored = { ...preserveRouteData(mapped, previous), ...mapped };
    aircraft.set(mapped.icao, stored);
    routes.enrich(mapped, aircraft);
  }

  return {
    list,
    update,
    clear: () => aircraft.clear(),
    setRouteLookupsEnabled: routes.setEnabled,
  };
}
