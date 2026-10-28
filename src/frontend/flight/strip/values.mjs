import { formatAircraftStripFields } from "./fields.mjs";

export function valuesOf(aircraft) {
  const fields = formatAircraftStripFields(aircraft);
  return [
    fields.callsign,
    fields.altitude,
    fields.aircraftType,
    fields.headingAndSpeed,
    fields.squawk,
    "",
    fields.bearingAndRange,
    fields.origin,
    fields.destination,
  ];
}
