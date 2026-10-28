import { groupRunwayEnds } from "./groups.mjs";

export function attachAirportRunways(airports, runwayStatement) {
  if (!airports.length) return [];
  const runways = groupRunwayEnds(
    runwayStatement.all(JSON.stringify(airports.map(({ faaId }) => faaId))),
  );
  return airports.map((airport) => ({
    ...airport,
    runways: runways.get(airport.faaId) ?? [],
  }));
}
