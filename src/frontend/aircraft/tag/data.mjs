import { formatAircraftName } from "../name.mjs";
import { formatAircraftSpeed } from "../speed.mjs";
import { formatAircraftAltitude } from "./altitude.mjs";

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
