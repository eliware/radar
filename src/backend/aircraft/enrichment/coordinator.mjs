import { createAircraftMetadataStore } from "../metadata-store.mjs";
import { normalizeAircraftMetadataKey } from "./metadata-key.mjs";
import { createAircraftState } from "./aircraft-state.mjs";
import { createAircraftRouteLookup } from "./route-lookup.mjs";
import { createAircraftTypeLookup } from "./type-lookup.mjs";

export function createAircraftEnrichmentCoordinator(lookup) {
  const metadata = createAircraftMetadataStore();
  const state = createAircraftState();
  let closed = false;

  function enrich(aircraft) {
    return metadata.enrich(
      aircraft,
      normalizeAircraftMetadataKey(aircraft.icao),
      normalizeAircraftMetadataKey(aircraft.callsign),
    );
  }

  function publishIfChanged(icao, changed, publish) {
    const aircraft = state.get(icao);
    if (closed || !changed || !aircraft) return;
    publish(enrich(aircraft));
  }

  const typeLookup = createAircraftTypeLookup(lookup, metadata, publishIfChanged);
  const routeLookup = createAircraftRouteLookup(lookup, metadata, publishIfChanged);

  function update(aircraft, publish) {
    if (closed) return;
    const update = state.update(aircraft);
    if (!update) return;
    const { icao, aircraft: latest } = update;
    const callsign = normalizeAircraftMetadataKey(latest.callsign);
    const enriched = enrich(latest);
    publish(enrich(latest));
    typeLookup.request(icao, enriched, publish);
    routeLookup.request(icao, callsign, enriched, publish);
  }

  return {
    update,
    enrich,
    setRouteLookupsEnabled: routeLookup.setEnabled,
    retain: state.retain,
    close() {
      closed = true;
      state.clear();
    },
  };
}
