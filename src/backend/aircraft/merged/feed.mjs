import { createMergedAircraftState } from "./aircraft/state.mjs";
import { createMergedAircraftClients } from "./clients.mjs";
import { createMergedAircraftSnapshotPublisher } from "./snapshot/publisher.mjs";

export function createMergedAircraftFeed(
  localFeed,
  remoteSource,
  { defaultRangeNm = 20, setIntervalFn = setInterval, clearIntervalFn = clearInterval } = {},
) {
  const clients = createMergedAircraftClients(defaultRangeNm);
  const state = createMergedAircraftState();
  let closed = false;
  function refresh() {
    state.replaceLocal(localFeed.list());
    state.replaceRemote(remoteSource.list());
  }
  refresh();
  const unsubscribeLocal = localFeed.subscribe((item) => state.setLocal(item));
  const unsubscribeRemote = remoteSource.subscribe((items) => state.replaceRemote(items));

  function publishSnapshots() {
    refresh();
    const aircraft = state.list();
    const localFurthestDistanceNm = state.localFurthestDistanceNm();
    clients.publish(aircraft, localFurthestDistanceNm);
  }
  const snapshots = createMergedAircraftSnapshotPublisher(
    publishSnapshots,
    setIntervalFn,
    clearIntervalFn,
  );

  return {
    list() {
      refresh();
      return state.list();
    },
    isReady: () => localFeed.isReady(),
    setRouteLookupsEnabled(value) {
      localFeed.setRouteLookupsEnabled?.(value);
      remoteSource.setRouteLookupsEnabled(value);
    },
    setClientRadius(key, value) {
      const radius = clients.setRadius(key, value);
      if (radius !== undefined) remoteSource.setClientRadius(key, radius);
    },
    setClientLocalOnly(key, value) {
      if (!clients.setLocalOnly(key, value)) return;
      remoteSource.setClientLocalOnly?.(key, value);
      publishSnapshots();
    },
    subscribe(send, key = Symbol("feed-client")) {
      if (closed) return () => false;
      clients.add(key, send);
      remoteSource.connectClient(key);
      snapshots.start();
      let active = true;
      return () => {
        if (!active) return false;
        active = false;
        clients.remove(key);
        remoteSource.disconnectClient(key);
        if (!clients.size) snapshots.stop();
        return true;
      };
    },
    close() {
      if (closed) return;
      closed = true;
      clients.clear();
      snapshots.stop();
      unsubscribeLocal();
      unsubscribeRemote();
      remoteSource.close();
    },
  };
}
