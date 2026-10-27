import { requestAdsbLolCircle } from "./request.mjs";
import { createAdsbLolPoller } from "./poller.mjs";
import { createAdsbLolAircraftStore } from "./aircraft-store.mjs";
import { createAdsbLolClients } from "./clients.mjs";
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
  const subscribers = new Set();
  const aircraft = createAdsbLolAircraftStore({
    location,
    lookup,
    clock,
    onRouteUpdate: publish,
  });
  const poller = createAdsbLolPoller({
    poll,
    hasClients: () => clients.hasRemoteClients,
    setTimeoutFn,
    clearTimeoutFn,
    onError,
    intervalMs: POLL_INTERVAL_MS,
  });
  function start() {
    poller.start();
  }
  function publish() {
    const current = aircraft.list();
    subscribers.forEach((subscriber) => subscriber(current));
  }
  async function poll(isCurrent) {
    if (!Number.isFinite(location?.latitude) || !Number.isFinite(location?.longitude)) {
      return;
    }
    const records = await requestAdsbLolCircle(request, location, clients.radiusNm);
    if (!isCurrent()) return;
    records.forEach((item) => aircraft.update(item));
    publish();
  }
  return {
    list: aircraft.list,
    subscribe(subscriber) {
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },
    connectClient(key) {
      clients.connect(key);
      start();
    },
    setClientRadius(key, value) {
      clients.setRadius(key, value);
    },
    setClientLocalOnly(key, value) {
      if (!clients.setLocalOnly(key, value)) return;
      if (clients.hasRemoteClients) start();
      else {
        poller.stop();
        aircraft.clear();
        publish();
      }
    },
    disconnectClient(key) {
      clients.disconnect(key);
      if (!clients.size) {
        poller.stop();
        aircraft.clear();
        publish();
      } else if (!clients.hasRemoteClients) {
        poller.stop();
        aircraft.clear();
        publish();
      }
    },
    setRouteLookupsEnabled(value) {
      aircraft.setRouteLookupsEnabled(value);
    },
    close() {
      poller.close();
      clients.clear();
      aircraft.clear();
      subscribers.clear();
    },
  };
}
