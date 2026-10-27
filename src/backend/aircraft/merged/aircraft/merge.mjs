export function mergeAircraftRecord({ local, remote }, now, localFreshnessMs) {
  if (!local) return { ...remote, remoteOnly: true };
  const localIsFresh = !Number.isFinite(local.lastSeen) || now - local.lastSeen <= localFreshnessMs;
  const useNewerRemote =
    !localIsFresh && Number.isFinite(remote?.lastSeen) && remote.lastSeen > local.lastSeen;
  const primary = useNewerRemote ? remote : local;
  const fallback = useNewerRemote ? local : remote;
  const combined = { ...fallback, ...primary };
  for (const [key, value] of Object.entries(fallback ?? {})) {
    if (key === "remoteOnly") continue;
    if (primary[key] === null || primary[key] === undefined || primary[key] === "")
      combined[key] = value;
  }
  combined.remoteOnly = false;
  return combined;
}

export function compareAircraftDistance(left, right) {
  return (left.distanceNauticalMiles ?? Infinity) - (right.distanceNauticalMiles ?? Infinity);
}
