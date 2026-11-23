import { default as formatAircraftStripFields } from "./fields.mjs";
import { default as formatAircraftStripCallsign } from "../../../shared/aircraft/strip/fields.mjs";

function valuesOf(aircraft) {
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
export default valuesOf;
