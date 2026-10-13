import { hasUsefulCallsign } from "../shared/aircraft-callsign.mjs";

export function createAircraftEnrichmentFeed(feed, lookup) {
  const subscribers = new Set();
  const typesByIcao = new Map();
  const routesByCallsign = new Map();
  const lastAircraft = new Map();

  function enrich(aircraft) {
    const route = routesByCallsign.get(normalize(aircraft.callsign));
    return {
      ...aircraft,
      ...typesByIcao.get(normalize(aircraft.icao)),
      ...route,
    };
  }

  function publish(aircraft) {
    lastAircraft.set(aircraft.icao, aircraft);
    for (const subscriber of subscribers) subscriber(enrich(aircraft));
  }

  function publishIfChanged(icao, before, after) {
    if (sameLookupData(before, after)) return;
    const aircraft = lastAircraft.get(icao);
    for (const subscriber of subscribers) subscriber(enrich(aircraft));
  }

  function onAircraft(aircraft) {
    if (!aircraft?.icao) return;
    publish(aircraft);
    const icao = normalize(aircraft.icao);
    const callsign = normalize(aircraft.callsign);
    lookup
      .getAircraftType(icao)
      .then((result) => {
        const before = typesByIcao.get(icao);
        if (result?.aircraftTypeCode) remember(typesByIcao, icao, result);
        publishIfChanged(icao, before, typesByIcao.get(icao));
      })
      .catch(() => undefined);
    if (!hasUsefulCallsign(callsign)) return;
    lookup
      .getCallsignRoute(callsign)
      .then((result) => {
        const before = routesByCallsign.get(callsign);
        if (result?.origin || result?.destination) remember(routesByCallsign, callsign, result);
        publishIfChanged(icao, before, routesByCallsign.get(callsign));
      })
      .catch(() => undefined);
  }

  const unsubscribeFeed = feed.subscribe(onAircraft);
  return {
    list() {
      return feed.list().map(enrich);
    },
    subscribe(subscriber) {
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },
    close() {
      unsubscribeFeed();
      subscribers.clear();
    },
  };
}

function normalize(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

function remember(cache, key, value) {
  cache.delete(key);
  cache.set(key, value);
  if (cache.size > 256) cache.delete(cache.keys().next().value);
}

function sameLookupData(before = {}, after = {}) {
  return (
    before.aircraftTypeCode === after.aircraftTypeCode &&
    before.origin === after.origin &&
    before.destination === after.destination
  );
}
