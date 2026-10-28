import { filterAircraftSnapshot } from "./snapshot/filter.mjs";

const MAX_VIEW_RADIUS_NM = 300;

export function createMergedAircraftClients(defaultRangeNm) {
  const clients = new Map();
  return {
    get size() {
      return clients.size;
    },
    add(key, send) {
      clients.set(key, { send, radiusNm: clampRadius(defaultRangeNm), localOnly: false });
    },
    setRadius(key, value) {
      const client = clients.get(key);
      if (!client || !Number.isFinite(value)) return undefined;
      client.radiusNm = clampRadius(value);
      return client.radiusNm;
    },
    setLocalOnly(key, value) {
      const client = clients.get(key);
      if (!client || typeof value !== "boolean") return false;
      client.localOnly = value;
      return true;
    },
    remove(key) {
      return clients.delete(key);
    },
    clear() {
      clients.clear();
    },
    publish(aircraft, localFurthestDistanceNm) {
      for (const client of clients.values()) {
        const visible = filterAircraftSnapshot(aircraft, client.radiusNm, client.localOnly);
        client.send({ event: "aircraft-snapshot", aircraft: visible, localFurthestDistanceNm });
      }
    },
  };
}

function clampRadius(value) {
  return Math.min(MAX_VIEW_RADIUS_NM, Math.max(1, Math.ceil(value)));
}
