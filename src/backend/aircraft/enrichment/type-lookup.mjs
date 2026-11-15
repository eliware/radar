export function createAircraftTypeLookup(lookup, metadata, publishIfChanged) {
  const pending = new Map();

  function request(icao, enriched, publish) {
    if (enriched.aircraftTypeCode || pending.has(icao)) return;
    const requestPromise = Promise.resolve(lookup.getAircraftType(icao));
    pending.set(icao, requestPromise);
    requestPromise
      .then((result) => {
        pending.delete(icao);
        publishIfChanged(icao, metadata.updateType(icao, result), publish);
      })
      .catch(() => pending.delete(icao));
  }

  return { request };
}
