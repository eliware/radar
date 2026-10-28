export function createAdsbLolRouteLookup(lookup) {
  let enabled = true;
  let generation = 0;

  function request(mapped, aircraft, onResult) {
    if (!enabled || !lookup || !mapped.callsign) return;
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
          onResult(result);
        }
      })
      .catch(() => {});
  }

  return {
    request,
    setEnabled(value) {
      const next = Boolean(value);
      if (next !== enabled) generation += 1;
      enabled = next;
    },
  };
}
