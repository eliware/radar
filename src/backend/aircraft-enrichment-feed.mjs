import { createAircraftEnrichmentCoordinator } from "./aircraft-enrichment-coordinator.mjs";

export function createAircraftEnrichmentFeed(feed, lookup) {
  const subscribers = new Set();
  const coordinator = createAircraftEnrichmentCoordinator(lookup);
  const publish = (aircraft) => {
    for (const subscriber of subscribers) subscriber(aircraft);
  };
  const unsubscribeFeed = feed.subscribe((aircraft) => coordinator.update(aircraft, publish));
  return {
    list: () => feed.list().map(coordinator.enrich),
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
