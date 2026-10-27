import { requestAdsbLolCircle } from "./request.mjs";
import { createAdsbLolPoller } from "./poller.mjs";
import { createAdsbLolAircraftStore } from "./aircraft-store.mjs";
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
  const clients = new Map();
  const subscribers = new Set();
  const aircraft = createAdsbLolAircraftStore({
    location,
    lookup,
    clock,
    onRouteUpdate: publish,
  });
  const poller = createAdsbLolPoller({
    poll,
    hasClients: () => [...clients.values()].some((client) => !client.localOnly),
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
    let radius = 0;
    for (const client of clients.values())
      if (!client.localOnly) radius = Math.max(radius, client.radiusNm);
    radius = Math.min(MAX_RADIUS_NM, radius);
    const records = await requestAdsbLolCircle(request, location, radius);
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
      clients.set(key, {
        radiusNm: Math.min(MAX_RADIUS_NM, Math.max(1, defaultRangeNm)),
        localOnly: false,
      });
      start();
    },
    setClientRadius(key, value) {
      const client = clients.get(key);
      if (client && Number.isFinite(value))
        client.radiusNm = Math.min(MAX_RADIUS_NM, Math.max(1, Math.ceil(value)));
    },
    setClientLocalOnly(key, value) {
      const client = clients.get(key);
      if (!client || typeof value !== "boolean") return;
      client.localOnly = value;
      if ([...clients.values()].some((item) => !item.localOnly)) start();
      else {
        poller.stop();
        aircraft.clear();
        publish();
      }
    },
    disconnectClient(key) {
      clients.delete(key);
      if (!clients.size) {
        poller.stop();
        aircraft.clear();
        publish();
      } else if (![...clients.values()].some((item) => !item.localOnly)) {
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
