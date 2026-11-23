import { default as groupRunwayEnds } from "./groups.mjs";

function attachAirportRunways(airports, runwayStatement) {
  if (!airports.length) return [];
  const runways = groupRunwayEnds(
    runwayStatement.all(JSON.stringify(airports.map(({ faaId }) => faaId))),
  );
  return airports.map((airport) => ({
    ...airport,
    runways: runways.get(airport.faaId) ?? [],
  }));
}
export default attachAirportRunways;
