export function selectAircraftRecordSources(local, remote, now, localFreshnessMs) {
  if (!local) return { primary: remote, fallback: null, remoteOnly: true };
  const localIsFresh = !Number.isFinite(local.lastSeen) || now - local.lastSeen <= localFreshnessMs;
  const useNewerRemote =
    !localIsFresh && Number.isFinite(remote?.lastSeen) && remote.lastSeen > local.lastSeen;
  return {
    primary: useNewerRemote ? remote : local,
    fallback: useNewerRemote ? local : remote,
    remoteOnly: false,
  };
}
