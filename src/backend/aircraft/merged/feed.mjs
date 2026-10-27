import { createMergedAircraftState } from "./aircraft-state.mjs";
import { createMergedAircraftClients } from "./clients.mjs";

const SNAPSHOT_INTERVAL_MS = 1000;

export function createMergedAircraftFeed(
  localFeed,
  remoteSource,
  { defaultRangeNm = 20, setIntervalFn = setInterval, clearIntervalFn = clearInterval } = {},
) {
  const clients = createMergedAircraftClients(defaultRangeNm);
  const state = createMergedAircraftState();
  let snapshotTimer;
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
      if (snapshotTimer === undefined)
        snapshotTimer = setIntervalFn(publishSnapshots, SNAPSHOT_INTERVAL_MS);
      let active = true;
      return () => {
        if (!active) return false;
        active = false;
        clients.remove(key);
        remoteSource.disconnectClient(key);
        if (!clients.size && snapshotTimer !== undefined) {
          clearIntervalFn(snapshotTimer);
          snapshotTimer = undefined;
        }
        return true;
      };
    },
    close() {
      if (closed) return;
      closed = true;
      clients.clear();
      if (snapshotTimer !== undefined) clearIntervalFn(snapshotTimer);
      snapshotTimer = undefined;
      unsubscribeLocal();
      unsubscribeRemote();
      remoteSource.close();
    },
  };
}
