import { default as hasUsefulCallsign } from "../callsign.mjs";

function formatAircraftStripCallsign(aircraft) {
  const callsign = aircraft.callsign?.trim();
  return hasUsefulCallsign(callsign) ? callsign : aircraft.icao || "-";
}
export default formatAircraftStripCallsign;
