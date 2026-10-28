const MAX_TRAIL_POINTS = 20;
const MAX_TRAIL_AGE_MS = 60_000;
const MIN_MOVEMENT_NM = 0.005;

export function createAircraftTrails(clock = Date.now) {
  const trails = new Map();
  const receivedAt = new Map();
  return {
    add(icao, position, observedAt = clock()) {
      if (!icao || !position || ![position.x, position.y, position.z].every(Number.isFinite))
        return;
      const now = clock();
      receivedAt.set(icao, Number.isFinite(observedAt) ? observedAt : now);
      const points = recentPoints(trails.get(icao) ?? [], now);
      const last = points.at(-1);
      if (last && distance(last, position) < MIN_MOVEMENT_NM) return;
      points.push({ x: position.x, y: position.y, z: position.z, recordedAt: now });
      if (points.length > MAX_TRAIL_POINTS) points.shift();
      trails.set(icao, points);
    },
    remove(icaos) {
      for (const icao of icaos) {
        trails.delete(icao);
        receivedAt.delete(icao);
      }
    },
    get(icao) {
      const points = recentPoints(trails.get(icao) ?? [], clock());
      trails.set(icao, points);
      return points;
    },
    clear() {
      trails.clear();
      receivedAt.clear();
    },
    withReceivedAt(items) {
      return new Map(
        [...items].map(([icao, item]) => [
          icao,
          { ...item, receivedAt: receivedAt.get(icao) ?? item.lastSeen },
        ]),
      );
    },
  };
}

function recentPoints(points, now) {
  return points.filter((point) => now - point.recordedAt <= MAX_TRAIL_AGE_MS);
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}
