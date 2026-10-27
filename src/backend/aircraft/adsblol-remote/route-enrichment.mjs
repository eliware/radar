export function createAdsbLolRouteEnrichment({ lookup, onRouteUpdate = () => {} }) {
  let enabled = true;
  let generation = 0;

  function preserve(mapped, previous) {
    return previous?.callsign === mapped.callsign ? previous : {};
  }

  function enrich(mapped, aircraft) {
    if (!enabled || !lookup || !mapped.callsign) return;
    const stored = aircraft.get(mapped.icao);
    if (stored?.origin && stored?.destination) return;
    const requestGeneration = generation;
    lookup
      .getCallsignRoute(mapped.callsign)
      .then((result) => {
        if (
          requestGeneration === generation &&
          enabled &&
          result &&
          aircraft.get(mapped.icao)?.callsign === mapped.callsign
        ) {
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
      const next = Boolean(value);
      if (next !== enabled) generation += 1;
      enabled = next;
    },
  };
}
