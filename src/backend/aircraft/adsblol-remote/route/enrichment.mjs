export function createAdsbLolRouteEnrichment({ lookup, onRouteUpdate = () => {} }) {
  let enabled = true;
  let generation = 0;

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
    enrich,
    setEnabled: (value) => {
      const next = Boolean(value);
      if (next !== enabled) generation += 1;
      enabled = next;
    },
  };
}
