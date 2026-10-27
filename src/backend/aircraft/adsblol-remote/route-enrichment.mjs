export function createAdsbLolRouteEnrichment({ lookup, onRouteUpdate = () => {} }) {
  let enabled = true;

  function preserve(mapped, previous) {
    return previous?.callsign === mapped.callsign ? previous : {};
  }

  function enrich(mapped, aircraft) {
    if (!enabled || !lookup || !mapped.callsign) return;
    const stored = aircraft.get(mapped.icao);
    if (stored?.origin && stored?.destination) return;
    lookup
      .getCallsignRoute(mapped.callsign)
      .then((result) => {
        if (result && aircraft.get(mapped.icao)?.callsign === mapped.callsign) {
          aircraft.set(mapped.icao, { ...aircraft.get(mapped.icao), ...result });
          onRouteUpdate();
        }
      })
      .catch(() => {});
  }

  return {
    preserve,
    enrich,
    setEnabled: (value) => {
      enabled = Boolean(value);
    },
  };
}
