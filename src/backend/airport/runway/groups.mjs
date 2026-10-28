export function groupRunwayEnds(ends) {
  const airports = new Map();
  for (const end of ends) {
    if (!Number.isFinite(end.latitude) || !Number.isFinite(end.longitude)) continue;
    if (!Number.isFinite(end.alignmentDegrees)) continue;
    const runways = airports.get(end.airportId) ?? new Map();
    const group = runways.get(end.runwayId) ?? [];
    group.push(end);
    runways.set(end.runwayId, group);
    airports.set(end.airportId, runways);
  }
  return new Map(
    [...airports].map(([airportId, runways]) => [
      airportId,
      [...runways.values()].filter((group) => group.length === 2),
    ]),
  );
}
