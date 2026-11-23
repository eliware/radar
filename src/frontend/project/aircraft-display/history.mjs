function projectAircraftHistory(trails, icao, project) {
  return (trails.get(icao) ?? [])
    .map((point) => {
      const projected = project(point);
      if (!isVisible(projected)) return null;
      return Number.isFinite(point.recordedAt)
        ? { ...projected, recordedAt: point.recordedAt }
        : projected;
    })
    .filter(Boolean);
}

function isVisible(point) {
  return Number.isFinite(point?.x) && Number.isFinite(point?.y);
}
export default projectAircraftHistory;
