import { hasUsefulCallsign } from "../shared/aircraft-callsign.mjs";
import {
  createAircraftMetadataStore,
  normalizeAircraftMetadataKey,
} from "./aircraft-metadata-store.mjs";

export function createAircraftEnrichmentCoordinator(lookup) {
  const metadata = createAircraftMetadataStore();
  const lastAircraft = new Map();
  let closed = false;

  function publishIfChanged(icao, changed, publish) {
    const aircraft = lastAircraft.get(icao);
    if (closed || !changed || !aircraft) return;
    publish(metadata.enrich(aircraft));
  }

  function update(aircraft, publish) {
    if (closed || !aircraft?.icao) return;
    const icao = normalizeAircraftMetadataKey(aircraft.icao);
    const callsign = normalizeAircraftMetadataKey(aircraft.callsign);
    lastAircraft.set(icao, aircraft);
    publish(metadata.enrich(aircraft));
    lookup
      .getAircraftType(icao)
      .then((result) => publishIfChanged(icao, metadata.updateType(icao, result), publish))
      .catch(() => undefined);
    if (!hasUsefulCallsign(callsign)) return;
    lookup
      .getCallsignRoute(callsign)
      .then((result) => publishIfChanged(icao, metadata.updateRoute(callsign, result), publish))
      .catch(() => undefined);
  }

  return {
    update,
    enrich: (aircraft) => metadata.enrich(aircraft),
    retain(aircraft) {
      const live = new Set(aircraft.map((item) => normalizeAircraftMetadataKey(item.icao)));
      for (const icao of lastAircraft.keys()) if (!live.has(icao)) lastAircraft.delete(icao);
    },
    close() {
      closed = true;
      lastAircraft.clear();
    },
  };
}
