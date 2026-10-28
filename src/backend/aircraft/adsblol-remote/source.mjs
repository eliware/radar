import { createAdsbLolAircraftStore } from "./aircraft-store.mjs";
import { createAdsbLolClients } from "./clients.mjs";
import { getAdsbLolPollingPolicy } from "./policy.mjs";
import { createAdsbLolSubscribers } from "./subscribers.mjs";
import { createAdsbLolClientLifecycle } from "./client-lifecycle.mjs";
import { createAdsbLolRemotePolling } from "./polling.mjs";
import { createAdsbLolRemoteSourceApi } from "./source/api.mjs";
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
  let publish;
  const aircraft = createAdsbLolAircraftStore({
    location,
    lookup,
    clock,
    onRouteUpdate: () => publish(),
  });
  const subscribers = createAdsbLolSubscribers(aircraft.list);
  const sourceApi = createAdsbLolRemoteSourceApi({ aircraft, subscribers });
  publish = sourceApi.publish;
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
  return sourceApi.createPublicApi(clientLifecycle);
}
