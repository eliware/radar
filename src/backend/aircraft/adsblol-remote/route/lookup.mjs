import { createAdsbLolRouteLookupControl } from "./lookup-control.mjs";

export function createAdsbLolRouteLookup(lookup) {
  const control = createAdsbLolRouteLookupControl();

  function request(mapped, aircraft, onResult) {
    if (!control.isEnabled() || !lookup || !mapped.callsign) return;
    const requestGeneration = control.generation();
    lookup
      .getCallsignRoute(mapped.callsign)
      .then((result) => {
        if (
          control.isCurrent(requestGeneration) &&
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
    setEnabled: control.setEnabled,
  };
}
