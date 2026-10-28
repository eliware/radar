import { formatAircraftStripFields } from "./fields.mjs";
import { formatAircraftStripCallsign } from "../../../shared/aircraft/strip/fields.mjs";

export function valuesOf(aircraft) {
  const fields = formatAircraftStripFields(aircraft);
  return [
    formatAircraftStripCallsign(aircraft),
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
