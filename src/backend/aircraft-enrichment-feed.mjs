import { createAircraftEnrichmentCoordinator } from "./aircraft-enrichment-coordinator.mjs";

export function createAircraftEnrichmentFeed(feed, lookup) {
  const subscribers = new Set();
  const coordinator = createAircraftEnrichmentCoordinator(lookup);
  let closed = false;
  const publish = (aircraft) => {
    const current = feed.list();
    coordinator.retain(current);
    if (!current.some((item) => item.icao === aircraft?.icao)) return;
    for (const subscriber of subscribers) subscriber(aircraft);
  };
  const unsubscribeFeed = feed.subscribe((aircraft) => coordinator.update(aircraft, publish));
  return {
    list() {
      const current = feed.list();
      coordinator.retain(current);
      return current.map(coordinator.enrich);
    },
    subscribe(subscriber) {
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },
    isReady: () => feed.isReady(),
    setRouteLookupsEnabled: (enabled) => coordinator.setRouteLookupsEnabled(enabled),
    close() {
      if (closed) return;
      closed = true;
      unsubscribeFeed();
      subscribers.clear();
      coordinator.close();
    },
  };
}
