export function createAdsbLolClients(defaultRangeNm, maximumRangeNm) {
  const clients = new Map();
  return {
    get size() {
      return clients.size;
    },
    settings: () => [...clients.values()].map((client) => ({ ...client })),
    connect(key) {
      clients.set(key, {
        radiusNm: Math.min(maximumRangeNm, Math.max(1, defaultRangeNm)),
        localOnly: false,
      });
    },
    setRadius(key, value) {
      const client = clients.get(key);
      if (client && Number.isFinite(value))
        client.radiusNm = Math.min(maximumRangeNm, Math.max(1, Math.ceil(value)));
    },
    setLocalOnly(key, value) {
      const client = clients.get(key);
      if (!client || typeof value !== "boolean") return false;
      client.localOnly = value;
      return true;
    },
    disconnect(key) {
      clients.delete(key);
    },
    clear() {
      clients.clear();
    },
  };
}
