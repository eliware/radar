import { RADAR_TARGET_STALE_MS } from "./range.mjs";
import { pruneExpiredRadarTargets } from "./target-expiry.mjs";
import { removeRadarRemoteTargetsExcept } from "./remote-targets.mjs";

export function createRadarTargets({
  clock = Date.now,
  staleAfterMs = RADAR_TARGET_STALE_MS,
} = {}) {
  const targets = new Map();
  const prune = () => pruneExpiredRadarTargets(targets, clock(), staleAfterMs);
  return {
    update(item, distance) {
      const expired = prune();
      targets.set(item.icao, {
        item,
        distance,
        lastSeen: Number.isFinite(item.lastSeen) ? Math.min(clock(), item.lastSeen) : clock(),
      });
      return expired;
    },
    removeRemoteOnlyExcept(icaos) {
      return removeRadarRemoteTargetsExcept(targets, icaos);
    },
    retain(icaos) {
      const keep = new Set(icaos);
      const removed = [];
      for (const icao of targets.keys())
        if (!keep.has(icao)) {
          targets.delete(icao);
          removed.push(icao);
        }
      return removed;
    },
    prune,
    distances() {
      return [...targets.values()].map(({ distance }) => distance);
    },
    localDistances() {
      return [...targets.values()]
        .filter(({ item }) => !item.remoteOnly)
        .map(({ distance }) => distance);
    },
    items() {
      return new Map([...targets].map(([icao, { item }]) => [icao, item]));
    },
  };
}
