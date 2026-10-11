export function formatAircraftTag(aircraft) {
  const callsign = aircraft.callsign?.trim();
  const name =
    !callsign || ["AD", "OK", "RM", "UNKNOWN", "-"].includes(callsign.toUpperCase())
      ? aircraft.icao || "-"
      : callsign;
  const altitude = Number.isFinite(aircraft.altitudeFeet)
    ? Math.round(aircraft.altitudeFeet / 100)
    : null;
  const rate = aircraft.verticalRateFeetPerMinute;
  const altitudeLine = altitude === null ? "-" : formatAltitude(altitude, rate);
  const speed = Number.isFinite(aircraft.groundSpeedKnots)
    ? String(Math.round(aircraft.groundSpeedKnots))
    : "-";
  return [name, altitudeLine, speed];
}

function formatAltitude(altitude, rate) {
  if (!Number.isFinite(rate)) return String(altitude);
  if (Math.abs(rate) <= 100) return `${altitude}C`;
  const change = String(Math.round(Math.abs(rate) / 100)).padStart(2, "0");
  return `${altitude}${rate > 0 ? "+" : "-"}${change}`;
}
