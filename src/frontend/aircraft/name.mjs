import { formatAircraftStripCallsign } from "../../shared/aircraft/strip/fields.mjs";

export function formatAircraftName(aircraft) {
  return formatAircraftStripCallsign(aircraft);
}
