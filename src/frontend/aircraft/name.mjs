import { hasUsefulCallsign } from "../../shared/aircraft/callsign.mjs";

export function formatAircraftName(aircraft) {
  const callsign = aircraft.callsign?.trim();
  return hasUsefulCallsign(callsign) ? callsign : aircraft.icao || "-";
}
