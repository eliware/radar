import { RADAR_TARGET_STALE_MS } from "../radar/range.mjs";

const MAX_TRAIL_POINTS = 120;
const MAX_TRAIL_AGE_MS = RADAR_TARGET_STALE_MS;
const MIN_MOVEMENT_NM = 0.005;

function createAircraftTrails(clock = Date.now) {
  const trails = new Map();
  return {
    add(icao, position) {
      if (!icao || !position || ![position.x, position.y, position.z].every(Number.isFinite))
        return;
      const now = clock();
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
      }
    },
    get(icao) {
      const points = recentPoints(trails.get(icao) ?? [], clock());
      trails.set(icao, points);
      return points;
    },
    clear() {
      trails.clear();
    },
  };
}

function recentPoints(points, now) {
  return points.filter((point) => now - point.recordedAt < MAX_TRAIL_AGE_MS);
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}
export default createAircraftTrails;
