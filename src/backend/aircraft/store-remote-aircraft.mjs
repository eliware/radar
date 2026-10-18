export function storeRemoteAircraft(aircraft, mapped, lookup, routeLookupsEnabled, publish) {
  const previous = aircraft.get(mapped.icao);
  const route = previous?.callsign === mapped.callsign ? previous : {};
  const stored = { ...route, ...mapped };
  aircraft.set(mapped.icao, stored);
  if (!routeLookupsEnabled || !lookup || !mapped.callsign || (stored.origin && stored.destination))
    return;
  lookup
    .getCallsignRoute(mapped.callsign)
    .then((result) => {
      if (result && aircraft.get(mapped.icao)?.callsign === mapped.callsign) {
        aircraft.set(mapped.icao, { ...aircraft.get(mapped.icao), ...result });
        publish();
      }
    })
    .catch(() => {});
}
