import { createAircraftEnrichmentState } from "./aircraft-state.mjs";
import { createAircraftRouteLookup } from "./route-lookup.mjs";
import { createAircraftTypeLookup } from "./type-lookup.mjs";

export function createAircraftEnrichmentCoordinator(lookup) {
  const state = createAircraftEnrichmentState();
  let closed = false;

  function publishIfChanged(icao, changed, publish) {
    const aircraft = state.get(icao);
    if (closed || !changed || !aircraft) return;
    publish(state.enrich(aircraft));
  }

  const typeLookup = createAircraftTypeLookup(lookup, state.metadata, publishIfChanged);
  const routeLookup = createAircraftRouteLookup(lookup, state.metadata, publishIfChanged);

  function update(aircraft, publish) {
    if (closed) return;
    const update = state.update(aircraft);
    if (!update) return;
    const { icao, callsign, enriched } = update;
    publish(enriched);
    typeLookup.request(icao, enriched, publish);
    routeLookup.request(icao, callsign, enriched, publish);
  }

  return {
    update,
    enrich: state.enrich,
    setRouteLookupsEnabled: routeLookup.setEnabled,
    retain: state.retain,
    close() {
      closed = true;
      state.clear();
    },
  };
}
