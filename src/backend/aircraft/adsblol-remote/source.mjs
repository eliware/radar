import { createAdsbLolAircraftStore } from "./aircraft-store.mjs";
import { createAdsbLolClients } from "./clients.mjs";
import { getAdsbLolPollingPolicy } from "./policy.mjs";
import { createAdsbLolSubscribers } from "./subscribers.mjs";
import { createAdsbLolClientLifecycle } from "./client-lifecycle.mjs";
import { createAdsbLolRemotePolling } from "./polling.mjs";
const POLL_INTERVAL_MS = 6000;
const MAX_RADIUS_NM = 300;
export function createAdsbLolRemoteSource({
  location,
  defaultRangeNm = 20,
  lookup,
  request = globalThis.fetch,
  clock = Date.now,
  setTimeoutFn = setTimeout,
  clearTimeoutFn = clearTimeout,
  onError = () => {},
}) {
  const clients = createAdsbLolClients(defaultRangeNm, MAX_RADIUS_NM);
  const pollingPolicy = () => getAdsbLolPollingPolicy(clients, MAX_RADIUS_NM);
  const aircraft = createAdsbLolAircraftStore({
    location,
    lookup,
    clock,
    onRouteUpdate: publish,
  });
  const subscribers = createAdsbLolSubscribers(aircraft.list);
  const poller = createAdsbLolRemotePolling({
    location,
    request,
    pollingPolicy,
    aircraft,
    publish,
    hasClients: () => pollingPolicy().hasRemoteClients,
    setTimeoutFn,
    clearTimeoutFn,
    onError,
    intervalMs: POLL_INTERVAL_MS,
  });
  const clientLifecycle = createAdsbLolClientLifecycle({
    clients,
    pollingPolicy,
    poller,
    aircraft,
    publish,
  });
  function publish() {
    subscribers.publish();
  }
  return {
    list: aircraft.list,
    subscribe: subscribers.subscribe,
    connectClient: clientLifecycle.connect,
    setClientRadius: clientLifecycle.setRadius,
    setClientLocalOnly: clientLifecycle.setLocalOnly,
    disconnectClient: clientLifecycle.disconnect,
    setRouteLookupsEnabled(value) {
      aircraft.setRouteLookupsEnabled(value);
    },
    close() {
      clientLifecycle.close();
      subscribers.clear();
    },
  };
}
