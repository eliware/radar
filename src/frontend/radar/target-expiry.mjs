export function pruneExpiredRadarTargets(targets, now, staleAfterMs) {
  const expired = [];
  for (const [icao, target] of targets) {
    if (now - target.lastSeen <= staleAfterMs) continue;
    targets.delete(icao);
    expired.push(icao);
  }
  return expired;
}
