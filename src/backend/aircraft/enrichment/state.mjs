import { createAircraftMetadataStore } from "../metadata-store.mjs";
import { createAircraftState } from "./aircraft-state.mjs";
import { normalizeAircraftMetadataKey } from "./metadata-key.mjs";

export function createAircraftEnrichmentState() {
  const metadata = createAircraftMetadataStore();
  const aircraftState = createAircraftState();

  function enrich(aircraft) {
    return metadata.enrich(
      aircraft,
      normalizeAircraftMetadataKey(aircraft.icao),
      normalizeAircraftMetadataKey(aircraft.callsign),
    );
  }

  return {
    metadata,
    update(aircraft) {
      const update = aircraftState.update(aircraft);
      if (!update) return null;
      const { icao, aircraft: latest } = update;
      return {
        icao,
        callsign: normalizeAircraftMetadataKey(latest.callsign),
        aircraft: latest,
        enriched: enrich(latest),
      };
    },
    enrich,
    get: aircraftState.get,
    retain: aircraftState.retain,
    clear: aircraftState.clear,
  };
}
