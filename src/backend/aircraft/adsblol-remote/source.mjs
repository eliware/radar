import { normalizeRemoteAircraft } from "../remote-aircraft.mjs";
import { requestAdsbLolCircle } from "./request.mjs";
import { storeRemoteAircraft } from "../store-remote-aircraft.mjs";
const POLL_INTERVAL_MS = 5000;
const MAX_RADIUS_NM = 300;
export function createAdsbLolRemoteSource({
  location,
  defaultRangeNm = 20,
  lookup,
  request = globalThis.fetch,
  clock = Date.now,
  setIntervalFn = setInterval,
  clearIntervalFn = clearInterval,
  onError = () => {},
}) {
  const clients = new Map();
  const aircraft = new Map();
  const subscribers = new Set();
  let timer;
  let pending = false;
  let generation = 0;
  let routeLookupsEnabled = true;
  function list() {
    const now = clock();
    for (const [icao, item] of aircraft) if (now - item.lastSeen > 120_000) aircraft.delete(icao);
    return [...aircraft.values()];
  }
  function start() {
    if (timer === undefined) timer = setIntervalFn(poll, POLL_INTERVAL_MS);
  }
  function publish() {
    const current = list();
    subscribers.forEach((subscriber) => subscriber(current));
  }
  async function poll() {
    if (
      !clients.size ||
      pending ||
      !Number.isFinite(location?.latitude) ||
      !Number.isFinite(location?.longitude)
    )
      return;
    pending = true;
    const token = generation;
    const radius = Math.min(MAX_RADIUS_NM, Math.max(...clients.values()));
    try {
      const records = await requestAdsbLolCircle(request, location, radius);
      if (token !== generation || !clients.size) return;
      records.forEach((item) => update(item));
      publish();
    } catch (error) {
      if (token === generation) onError(error);
    } finally {
      pending = false;
    }
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
        if (timer !== undefined) clearIntervalFn(timer);
        timer = undefined;
        generation += 1;
        aircraft.clear();
        publish();
      }
    },
    setRouteLookupsEnabled(value) {
      routeLookupsEnabled = Boolean(value);
    },
    close() {
      if (timer !== undefined) clearIntervalFn(timer);
      timer = undefined;
      generation += 1;
      clients.clear();
      aircraft.clear();
      subscribers.clear();
    },
  };
}
