import { hasUsefulCallsign } from "../../../shared/aircraft/callsign.mjs";

export function createAircraftRouteLookup(lookup, metadata, publishIfChanged) {
  let enabled = true;
  let version = 0;

  function request(icao, callsign, enriched, publish) {
    if (!enabled || !hasUsefulCallsign(callsign) || (enriched.origin && enriched.destination))
      return;
    const requestVersion = version;
    lookup
      .getCallsignRoute(callsign)
      .then((result) => {
        if (requestVersion === version && enabled)
          publishIfChanged(icao, metadata.updateRoute(callsign, result), publish);
      })
      .catch(() => undefined);
  }

  return {
    request,
    setEnabled(value) {
      const next = Boolean(value);
      if (next !== enabled) version += 1;
      enabled = next;
    },
  };
}
