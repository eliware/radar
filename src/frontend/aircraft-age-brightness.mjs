import { RADAR_TARGET_STALE_MS } from "./radar-range.mjs";

export function getAircraftAgeBrightness(receivedAt, now = Date.now()) {
  if (!Number.isFinite(receivedAt)) return 1;
  const age = Math.max(0, now - receivedAt);
  return Math.max(0, 1 - age / RADAR_TARGET_STALE_MS);
}
