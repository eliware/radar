function reconcileCanvasRadarSnapshot(items, targets, trails, receiveTimes, updateTarget) {
  const aircraft = Array.isArray(items) ? items : [];
  const removed = targets.retain(aircraft.map((item) => item.icao));
  trails.remove(removed);
  receiveTimes.remove(removed);
  for (const item of aircraft) updateTarget(item, false);
  return aircraft;
}
export default reconcileCanvasRadarSnapshot;
