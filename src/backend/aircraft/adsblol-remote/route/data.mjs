export function preserveRouteData(mapped, previous) {
  return previous?.callsign === mapped.callsign ? previous : {};
}
