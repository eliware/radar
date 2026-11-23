import { default as createAdsbLolRouteLookup } from "./lookup.mjs";
import { default as applyAdsbLolRouteResult } from "./apply.mjs";

function createAdsbLolRouteEnrichment({ lookup, onRouteUpdate = () => {} }) {
  const routeLookup = createAdsbLolRouteLookup(lookup);

  function enrich(mapped, aircraft) {
    const stored = aircraft.get(mapped.icao);
    if (stored?.origin && stored?.destination) return;
    routeLookup.request(mapped, aircraft, (result) => {
      applyAdsbLolRouteResult(aircraft, mapped.icao, result, onRouteUpdate);
    });
  }

  return {
    enrich,
    setEnabled: routeLookup.setEnabled,
  };
}
export default createAdsbLolRouteEnrichment;
