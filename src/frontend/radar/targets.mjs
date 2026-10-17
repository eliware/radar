import { RADAR_TARGET_STALE_MS } from "./range.mjs";

export function createRadarTargets({
  clock = Date.now,
  staleAfterMs = RADAR_TARGET_STALE_MS,
} = {}) {
  const targets = new Map();
  const prune = () => {
    const now = clock();
    const expired = [];
    for (const [icao, target] of targets) {
      if (now - target.lastSeen <= staleAfterMs) continue;
      targets.delete(icao);
      expired.push(icao);
    }
    return expired;
  };
  return {
    update(item, distance) {
      const expired = prune();
      targets.set(item.icao, { item, distance, lastSeen: clock() });
      return expired;
    },
    prune,
    distances() {
      return [...targets.values()].map(({ distance }) => distance);
    },
    items() {
      return new Map(
        [...targets].map(([icao, { item, lastSeen }]) => [icao, { ...item, receivedAt: lastSeen }]),
      );
    },
  };
}
