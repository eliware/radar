import { isValidRunwayEnd } from "./valid-end.mjs";

export function groupRunwayEnds(ends) {
  const airports = new Map();
  for (const end of ends) {
    if (!isValidRunwayEnd(end)) continue;
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
