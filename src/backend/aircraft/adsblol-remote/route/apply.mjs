export function applyAdsbLolRouteResult(aircraft, icao, result) {
  const current = aircraft.get(icao);
  aircraft.set(icao, { ...current, ...result });
}
