import { default as formatAircraftStripCallsign } from "../../shared/aircraft/strip/fields.mjs";

function formatAircraftName(aircraft) {
  return formatAircraftStripCallsign(aircraft);
}
export default formatAircraftName;
