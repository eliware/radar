import { default as createAdsbLolAircraftStore } from "./aircraft-store.mjs";
import { default as createAircraftClientState } from "../client-state.mjs";
import { default as getAdsbLolPollingPolicy } from "./policy.mjs";
import { default as createAdsbLolSubscribers } from "./subscribers.mjs";
import { default as createAdsbLolClientLifecycle } from "./client-lifecycle.mjs";
import { default as createAdsbLolRemotePolling } from "./polling.mjs";
import { default as createAdsbLolRemoteSourceApi } from "./source/api.mjs";
import { MAX_RADIUS_NM, POLL_INTERVAL_MS } from "./settings.mjs";
function createAdsbLolRemoteSource({
  location,
  defaultRangeNm = 20,
  enabled = true,
  pollIntervalMs = POLL_INTERVAL_MS,
  lookup,
  request = globalThis.fetch,
  clock = Date.now,
  setTimeoutFn = setTimeout,
  clearTimeoutFn = clearTimeout,
  onError = () => {},
  onRequest = () => {},
}) {
  const clients = createAircraftClientState(defaultRangeNm, MAX_RADIUS_NM);
  const pollingPolicy = () => getAdsbLolPollingPolicy(clients, MAX_RADIUS_NM);
  let publish;
  const aircraft = createAdsbLolAircraftStore({
    location,
    lookup,
    clock,
    onRouteUpdate: () => publish(),
  });
  const subscribers = createAdsbLolSubscribers(aircraft.list);
  const sourceApi = createAdsbLolRemoteSourceApi({ aircraft, subscribers, clients });
  publish = sourceApi.publish;
  const poller = createAdsbLolRemotePolling({
    location,
    request,
    pollingPolicy,
    aircraft,
    publish,
    hasClients: () => enabled && pollingPolicy().hasRemoteClients,
    setTimeoutFn,
    clearTimeoutFn,
    onError,
    onRequest,
    intervalMs: pollIntervalMs,
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
export default createAdsbLolRemoteSource;
