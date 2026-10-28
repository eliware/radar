export function formatAircraftStripSpeed(aircraft) {
  return Number.isFinite(aircraft.groundSpeedKnots)
    ? String(Math.round(aircraft.groundSpeedKnots))
    : "-";
}
