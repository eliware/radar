export function createAdsbLolSubscribers(listAircraft) {
  const subscribers = new Set();
  return {
    subscribe(subscriber) {
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },
    publish() {
      const current = listAircraft();
      subscribers.forEach((subscriber) => subscriber(current));
    },
    clear() {
      subscribers.clear();
    },
  };
}
