import { normalizeRemoteAircraft } from "../remote-aircraft.mjs";
import { requestAdsbLolCircle } from "./request.mjs";
import { createAdsbLolPoller } from "./poller.mjs";
import { storeRemoteAircraft } from "../store-remote-aircraft.mjs";
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
  const aircraft = new Map();
  const subscribers = new Set();
  let routeLookupsEnabled = true;
  const poller = createAdsbLolPoller({
    poll,
    hasClients: () => clients.size > 0,
    setTimeoutFn,
    clearTimeoutFn,
    onError,
    intervalMs: POLL_INTERVAL_MS,
  });
  function list() {
    const now = clock();
    for (const [icao, item] of aircraft) if (now - item.lastSeen > 120_000) aircraft.delete(icao);
    return [...aircraft.values()];
  }
  function start() {
    poller.start();
  }
  function publish() {
    const current = list();
    subscribers.forEach((subscriber) => subscriber(current));
  }
  async function poll(isCurrent) {
    if (!Number.isFinite(location?.latitude) || !Number.isFinite(location?.longitude)) {
      return;
    }
    const radius = Math.min(MAX_RADIUS_NM, Math.max(...clients.values()));
    const records = await requestAdsbLolCircle(request, location, radius);
    if (!isCurrent()) return;
    records.forEach((item) => update(item));
    publish();
  }
  function update(item) {
    const mapped = normalizeRemoteAircraft(item, location, clock());
    if (!mapped) return;
    storeRemoteAircraft(aircraft, mapped, lookup, routeLookupsEnabled, publish);
  }
  return {
    list,
    subscribe(subscriber) {
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },
    connectClient(key) {
      clients.set(key, Math.min(MAX_RADIUS_NM, Math.max(1, defaultRangeNm)));
      start();
    },
    setClientRadius(key, value) {
      if (clients.has(key) && Number.isFinite(value))
        clients.set(key, Math.min(MAX_RADIUS_NM, Math.max(1, Math.ceil(value))));
    },
    disconnectClient(key) {
      clients.delete(key);
      if (!clients.size) {
        poller.stop();
        aircraft.clear();
        publish();
      }
    },
    setRouteLookupsEnabled(value) {
      routeLookupsEnabled = Boolean(value);
    },
    close() {
      poller.close();
      clients.clear();
      aircraft.clear();
      subscribers.clear();
    },
  };
}
