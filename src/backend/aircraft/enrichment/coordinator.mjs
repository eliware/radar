import { retainUsefulCallsign } from "../../../shared/aircraft/callsign.mjs";
import { createAircraftMetadataStore } from "../metadata-store.mjs";
import { normalizeAircraftMetadataKey } from "./metadata-key.mjs";
import { createAircraftRouteLookup } from "./route-lookup.mjs";
import { createAircraftTypeLookup } from "./type-lookup.mjs";

export function createAircraftEnrichmentCoordinator(lookup) {
  const metadata = createAircraftMetadataStore();
  const lastAircraft = new Map();
  let closed = false;

  function enrich(aircraft) {
    return metadata.enrich(
      aircraft,
      normalizeAircraftMetadataKey(aircraft.icao),
      normalizeAircraftMetadataKey(aircraft.callsign),
    );
  }

  function publishIfChanged(icao, changed, publish) {
    const aircraft = lastAircraft.get(icao);
    if (closed || !changed || !aircraft) return;
    publish(enrich(aircraft));
  }

  const typeLookup = createAircraftTypeLookup(lookup, metadata, publishIfChanged);
  const routeLookup = createAircraftRouteLookup(lookup, metadata, publishIfChanged);

  function update(aircraft, publish) {
    if (closed || !aircraft?.icao) return;
    const icao = normalizeAircraftMetadataKey(aircraft.icao);
    const latest = { ...lastAircraft.get(icao), ...aircraft };
    const usefulCallsign = retainUsefulCallsign(
      lastAircraft.get(icao)?.callsign,
      aircraft.callsign,
    );
    if (usefulCallsign === null || usefulCallsign === undefined) delete latest.callsign;
    else latest.callsign = usefulCallsign;
    const callsign = normalizeAircraftMetadataKey(latest.callsign);
    const enriched = enrich(latest);
    lastAircraft.set(icao, latest);
    publish(enrich(latest));
    typeLookup.request(icao, enriched, publish);
    routeLookup.request(icao, callsign, enriched, publish);
  }

  return {
    update,
    enrich,
    setRouteLookupsEnabled: routeLookup.setEnabled,
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
