import { retainUsefulCallsign } from "../../../shared/aircraft/callsign.mjs";
import { createAircraftMetadataStore } from "../metadata-store.mjs";
import { normalizeAircraftMetadataKey } from "./metadata-key.mjs";

export function createAircraftState() {
  const aircraftByIcao = new Map();

  function update(aircraft) {
    if (!aircraft?.icao) return null;
    const icao = normalizeAircraftMetadataKey(aircraft.icao);
    const previous = aircraftByIcao.get(icao);
    const latest = { ...previous, ...aircraft };
    const callsign = retainUsefulCallsign(previous?.callsign, aircraft.callsign);
    if (callsign === null || callsign === undefined) delete latest.callsign;
    else latest.callsign = callsign;
    aircraftByIcao.set(icao, latest);
    return { icao, aircraft: latest };
  }

  function retain(liveAircraft) {
    const live = new Set(liveAircraft.map((item) => normalizeAircraftMetadataKey(item.icao)));
    for (const icao of aircraftByIcao.keys()) if (!live.has(icao)) aircraftByIcao.delete(icao);
  }

  return {
    update,
    get: (icao) => aircraftByIcao.get(icao),
    retain,
    clear: () => aircraftByIcao.clear(),
  };
}

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
