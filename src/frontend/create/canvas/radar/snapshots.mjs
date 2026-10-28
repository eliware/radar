export function reconcileCanvasRadarSnapshot(items, targets, trails, updateTarget) {
  const aircraft = Array.isArray(items) ? items : [];
  trails.remove(targets.retain(aircraft.map((item) => item.icao)));
  for (const item of aircraft) updateTarget(item, false);
  return aircraft;
}
