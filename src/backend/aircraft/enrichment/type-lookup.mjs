export function createAircraftTypeLookup(lookup, metadata, publishIfChanged) {
  function request(icao, enriched, publish) {
    if (enriched.aircraftTypeCode) return;
    lookup
      .getAircraftType(icao)
      .then((result) => publishIfChanged(icao, metadata.updateType(icao, result), publish))
      .catch(() => undefined);
  }

  return { request };
}
