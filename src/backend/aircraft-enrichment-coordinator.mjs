import { hasUsefulCallsign } from "../shared/aircraft-callsign.mjs";
import {
  createAircraftMetadataStore,
  normalizeAircraftMetadataKey,
} from "./aircraft-metadata-store.mjs";

export function createAircraftEnrichmentCoordinator(lookup) {
  const metadata = createAircraftMetadataStore();
  const lastAircraft = new Map();

  function publishIfChanged(icao, changed, publish) {
    if (!changed) return;
    publish(metadata.enrich(lastAircraft.get(icao)));
  }

  function update(aircraft, publish) {
    if (!aircraft?.icao) return;
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

  return { update, enrich: (aircraft) => metadata.enrich(aircraft) };
}
