import { createAdsbLolRouteLookup } from "./lookup.mjs";

export function createAdsbLolRouteEnrichment({ lookup, onRouteUpdate = () => {} }) {
  const routeLookup = createAdsbLolRouteLookup(lookup);

  function enrich(mapped, aircraft) {
    const stored = aircraft.get(mapped.icao);
    if (stored?.origin && stored?.destination) return;
    routeLookup.request(mapped, aircraft, (result) => {
      const current = aircraft.get(mapped.icao);
      aircraft.set(mapped.icao, { ...current, ...result });
      onRouteUpdate();
    });
  }

  return {
    enrich,
    setEnabled: routeLookup.setEnabled,
  };
}
