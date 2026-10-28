import { setMergedClientLocalOnly } from "./client-locality.mjs";
import { createMergedAircraftRuntime } from "./runtime.mjs";

export function createMergedAircraftFeed(
  localFeed,
  remoteSource,
  { defaultRangeNm = 20, setIntervalFn = setInterval, clearIntervalFn = clearInterval } = {},
) {
  const runtime = createMergedAircraftRuntime(localFeed, remoteSource, {
    defaultRangeNm,
    setIntervalFn,
    clearIntervalFn,
  });
  const { clients, state, refresh, publishSnapshots, snapshots } = runtime;
  let closed = false;
  const unsubscribeLocal = localFeed.subscribe((item) => state.setLocal(item));
  const unsubscribeRemote = remoteSource.subscribe((items) => state.replaceRemote(items));

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
      return setMergedClientLocalOnly(clients, remoteSource, key, value, publishSnapshots);
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
