import { default as formatAircraftName } from "../name.mjs";
import { default as formatAircraftSpeed } from "../speed.mjs";
import { default as formatAircraftAltitude } from "./altitude.mjs";

function formatAircraftTag(aircraft) {
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
export default formatAircraftTag;
