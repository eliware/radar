import { hasUsefulCallsign } from "./callsign.mjs";

export function formatAircraftStripCallsign(aircraft) {
  const callsign = aircraft.callsign?.trim();
  return hasUsefulCallsign(callsign) ? callsign : aircraft.icao || "-";
}

export function formatAircraftStripSpeed(aircraft) {
  return Number.isFinite(aircraft.groundSpeedKnots)
    ? String(Math.round(aircraft.groundSpeedKnots))
    : "-";
}

export function formatAircraftStripHeading(aircraft) {
  return Number.isFinite(aircraft.trackDegrees)
    ? `${String(Math.round(aircraft.trackDegrees) % 360).padStart(3, "0")}°`
    : "-";
}
