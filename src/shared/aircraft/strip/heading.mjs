export function formatAircraftStripHeading(aircraft) {
  return Number.isFinite(aircraft.trackDegrees)
    ? `${String(Math.round(aircraft.trackDegrees) % 360).padStart(3, "0")}°`
    : "-";
}
