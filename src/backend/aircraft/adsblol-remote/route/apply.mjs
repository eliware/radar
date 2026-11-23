function applyAdsbLolRouteResult(aircraft, icao, result, onRouteUpdate = () => {}) {
  const current = aircraft.get(icao);
  aircraft.set(icao, { ...current, ...result });
  onRouteUpdate();
}
export default applyAdsbLolRouteResult;
