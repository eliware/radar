import { hasUsefulCallsign } from "../callsign.mjs";

export function formatAircraftStripCallsign(aircraft) {
  const callsign = aircraft.callsign?.trim();
  return hasUsefulCallsign(callsign) ? callsign : aircraft.icao || "-";
}
