export function formatAircraftSpeed(aircraft) {
  return Number.isFinite(aircraft.groundSpeedKnots)
    ? String(Math.round(aircraft.groundSpeedKnots))
    : "-";
}
