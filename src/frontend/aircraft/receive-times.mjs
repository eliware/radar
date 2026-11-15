export function createAircraftReceiveTimes(clock = Date.now) {
  const receivedAt = new Map();
  return {
    set(icao, observedAt) {
      if (icao) receivedAt.set(icao, Number.isFinite(observedAt) ? observedAt : clock());
    },
    remove(icaos) {
      for (const icao of icaos) receivedAt.delete(icao);
    },
    clear() {
      receivedAt.clear();
    },
    withReceivedAt(items) {
      return new Map(
        [...items].map(([icao, item]) => [
          icao,
          { ...item, receivedAt: receivedAt.get(icao) ?? item.lastSeen },
        ]),
      );
    },
  };
}
