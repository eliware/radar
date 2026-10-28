export function projectAircraftHistory(trails, icao, project) {
  return (trails.get(icao) ?? []).map(project).filter(isVisible);
}

function isVisible(point) {
  return Number.isFinite(point?.x) && Number.isFinite(point?.y);
}
