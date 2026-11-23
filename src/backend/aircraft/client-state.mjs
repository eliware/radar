import { default as filterAircraftSnapshot } from "./merged/snapshot/filter.mjs";

function createAircraftClientState(defaultRangeNm, maximumRangeNm = 300) {
  const clients = new Map();
  const initialRadiusNm = clampRadius(defaultRangeNm, maximumRangeNm);

  return {
    get size() {
      return clients.size;
    },
    settings() {
      return [...clients.values()].map(({ radiusNm, localOnly }) => ({ radiusNm, localOnly }));
    },
    connect(key, send) {
      const client = clients.get(key) ?? { radiusNm: initialRadiusNm, localOnly: false };
      if (typeof send === "function") client.send = send;
      clients.set(key, client);
    },
    setRadius(key, value) {
      const client = clients.get(key);
      if (!client || !Number.isFinite(value)) return undefined;
      client.radiusNm = clampRadius(value, maximumRangeNm);
      return client.radiusNm;
    },
    setLocalOnly(key, value) {
      const client = clients.get(key);
      if (!client || typeof value !== "boolean") return false;
      client.localOnly = value;
      return true;
    },
    disconnect(key) {
      return clients.delete(key);
    },
    clear() {
      clients.clear();
    },
    publish(aircraft, localFurthestDistanceNm) {
      for (const client of clients.values()) {
        if (typeof client.send !== "function") continue;
        const visible = filterAircraftSnapshot(aircraft, client.radiusNm, client.localOnly);
        client.send({ event: "aircraft-snapshot", aircraft: visible, localFurthestDistanceNm });
      }
    },
  };
}

function clampRadius(value, maximumRangeNm) {
  return Math.min(maximumRangeNm, Math.max(1, Math.ceil(value)));
}
export default createAircraftClientState;
