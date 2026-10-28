import { formatAircraftName } from "./name.mjs";
import { formatAircraftSpeed } from "./speed.mjs";

export function formatAircraftTag(aircraft) {
  const altitudeLine = formatAircraftAltitude(aircraft);
  const speed = formatAircraftSpeed(aircraft);
  const typeCode = aircraft.aircraftTypeCode?.trim();
  const lines = [
    formatAircraftName(aircraft),
    altitudeLine,
    typeCode ? `${speed} ${typeCode}` : speed,
  ];
  return lines;
}

export function formatAircraftAltitude(aircraft) {
  const altitude = Number.isFinite(aircraft.altitudeFeet)
    ? Math.round(aircraft.altitudeFeet / 100)
    : null;
  return altitude === null ? "-" : formatAltitude(altitude, aircraft.verticalRateFeetPerMinute);
}

function formatAltitude(altitude, rate) {
  const value =
    altitude < 0
      ? `-${String(Math.abs(altitude)).padStart(2, "0")}`
      : String(altitude).padStart(3, "0");
  if (!Number.isFinite(rate)) return value;
  if (Math.abs(rate) <= 100) return `${value}C`;
  const change = String(Math.round(Math.abs(rate) / 100)).padStart(2, "0");
  return `${value}${rate > 0 ? "+" : "-"}${change}`;
}
