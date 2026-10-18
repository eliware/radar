import { hasUsefulCallsign, retainUsefulCallsign } from "../../../shared/aircraft/callsign.mjs";
import { createAircraftMetadataStore, normalizeAircraftMetadataKey } from "../metadata-store.mjs";

export function createAircraftEnrichmentCoordinator(lookup) {
  const metadata = createAircraftMetadataStore();
  const lastAircraft = new Map();
  let closed = false;
  let routeLookupsEnabled = true;
  let routeLookupVersion = 0;

  function publishIfChanged(icao, changed, publish) {
    const aircraft = lastAircraft.get(icao);
    if (closed || !changed || !aircraft) return;
    publish(metadata.enrich(aircraft));
  }

  function update(aircraft, publish) {
    if (closed || !aircraft?.icao) return;
    const icao = normalizeAircraftMetadataKey(aircraft.icao);
    const callsign = normalizeAircraftMetadataKey(aircraft.callsign);
    const latest = { ...lastAircraft.get(icao), ...aircraft };
    const enriched = metadata.enrich(latest);
    const usefulCallsign = retainUsefulCallsign(
      lastAircraft.get(icao)?.callsign,
      aircraft.callsign,
    );
    if (usefulCallsign === null || usefulCallsign === undefined) delete latest.callsign;
    else latest.callsign = usefulCallsign;
    lastAircraft.set(icao, latest);
    publish(metadata.enrich(latest));
    if (!enriched.aircraftTypeCode)
      lookup
        .getAircraftType(icao)
        .then((result) => publishIfChanged(icao, metadata.updateType(icao, result), publish))
        .catch(() => undefined);
    if (
      !routeLookupsEnabled ||
      !hasUsefulCallsign(callsign) ||
      (enriched.origin && enriched.destination)
    )
      return;
    const version = routeLookupVersion;
    lookup
      .getCallsignRoute(callsign)
      .then((result) => {
        if (version === routeLookupVersion && routeLookupsEnabled)
          publishIfChanged(icao, metadata.updateRoute(callsign, result), publish);
      })
      .catch(() => undefined);
  }

  return {
    update,
    enrich: (aircraft) => metadata.enrich(aircraft),
    setRouteLookupsEnabled(value) {
      const enabled = Boolean(value);
      if (enabled !== routeLookupsEnabled) routeLookupVersion += 1;
      routeLookupsEnabled = enabled;
    },
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
