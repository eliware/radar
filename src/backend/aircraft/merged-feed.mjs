export function createMergedAircraftFeed(localFeed, remoteSource) {
  const subscribers = new Set();
  let closed = false;
  const publish = (icao) => {
    const aircraft = mergedList().find((item) => key(item.icao) === key(icao));
    if (aircraft) subscribers.forEach((subscriber) => subscriber(aircraft));
  };
  const unsubscribeLocal = localFeed.subscribe((aircraft) => publish(aircraft.icao));
  const unsubscribeRemote = remoteSource.subscribe((items) => {
    const local = new Map(localFeed.list().map((item) => [key(item.icao), item]));
    const snapshot = items.map((aircraft) =>
      mergeAircraft(aircraft, local.get(key(aircraft.icao))),
    );
    subscribers.forEach((subscriber) =>
      subscriber({ event: "remote-snapshot", aircraft: snapshot }),
    );
  });
  function mergedList() {
    const aircraft = new Map(localFeed.list().map((item) => [key(item.icao), item]));
    for (const remote of remoteSource.list()) {
      const local = aircraft.get(key(remote.icao));
      aircraft.set(key(remote.icao), mergeAircraft(remote, local));
    }
    return [...aircraft.values()].sort(
      (left, right) =>
        (left.distanceNauticalMiles ?? Infinity) - (right.distanceNauticalMiles ?? Infinity),
    );
  }
  return {
    list: mergedList,
    isReady: () => localFeed.isReady(),
    setRouteLookupsEnabled(value) {
      localFeed.setRouteLookupsEnabled?.(value);
      remoteSource.setRouteLookupsEnabled(value);
    },
    setClientRadius: (keyValue, radius) => remoteSource.setClientRadius(keyValue, radius),
    subscribe(subscriber, keyValue = Symbol("feed-client")) {
      subscribers.add(subscriber);
      remoteSource.connectClient(keyValue);
      let active = true;
      return () => {
        if (!active) return false;
        active = false;
        const removed = subscribers.delete(subscriber);
        remoteSource.disconnectClient(keyValue);
        return removed;
      };
    },
    close() {
      if (closed) return;
      closed = true;
      subscribers.clear();
      unsubscribeLocal();
      unsubscribeRemote();
      remoteSource.close();
    },
  };
}

function mergeAircraft(remote, local) {
  if (!local) return { ...remote, remoteOnly: true };
  const merged = { ...remote, ...local, remoteOnly: false };
  for (const [name, value] of Object.entries(remote))
    if (local[name] === null || local[name] === undefined || local[name] === "")
      merged[name] = value;
  merged.remoteOnly = false;
  return merged;
}

function key(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}
