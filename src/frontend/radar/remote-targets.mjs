function removeRadarRemoteTargetsExcept(targets, icaos) {
  const keep = new Set(icaos);
  const removed = [];
  for (const [icao, target] of targets)
    if (target.item.remoteOnly && !keep.has(icao)) {
      targets.delete(icao);
      removed.push(icao);
    }
  return removed;
}
export default removeRadarRemoteTargetsExcept;
