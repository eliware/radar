import { createMergedAircraftState } from "./aircraft-state.mjs";

const SNAPSHOT_INTERVAL_MS = 1000;
const MAX_VIEW_RADIUS_NM = 300;

export function createMergedAircraftFeed(
  localFeed,
  remoteSource,
  { defaultRangeNm = 20, setIntervalFn = setInterval, clearIntervalFn = clearInterval } = {},
) {
  const clients = new Map();
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
    for (const client of clients.values()) {
      const visible = aircraft.filter(
        (item) =>
          Number.isFinite(item.distanceNauticalMiles) &&
          item.distanceNauticalMiles <= client.radiusNm &&
          (!client.localOnly || !item.remoteOnly),
      );
      client.send({ event: "aircraft-snapshot", aircraft: visible, localFurthestDistanceNm });
    }
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
      const client = clients.get(key);
      if (!client || !Number.isFinite(value)) return;
      client.radiusNm = clampRadius(value);
      remoteSource.setClientRadius(key, client.radiusNm);
    },
    setClientLocalOnly(key, value) {
      const client = clients.get(key);
      if (!client || typeof value !== "boolean") return;
      client.localOnly = value;
      remoteSource.setClientLocalOnly?.(key, value);
      publishSnapshots();
    },
    subscribe(send, key = Symbol("feed-client")) {
      if (closed) return () => false;
      clients.set(key, { send, radiusNm: clampRadius(defaultRangeNm), localOnly: false });
      remoteSource.connectClient(key);
      if (snapshotTimer === undefined)
        snapshotTimer = setIntervalFn(publishSnapshots, SNAPSHOT_INTERVAL_MS);
      let active = true;
      return () => {
        if (!active) return false;
        active = false;
        clients.delete(key);
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

function clampRadius(value) {
  return Math.min(MAX_VIEW_RADIUS_NM, Math.max(1, Math.ceil(value)));
}
