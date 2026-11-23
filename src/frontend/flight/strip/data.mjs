import { default as buildFlightStripLayout } from "./layout.mjs";
import { default as getAircraftEmergencyLabel } from "../../../shared/aircraft/emergency.mjs";
import { default as valuesOf } from "./values.mjs";
import { default as orderFlightStripAircraft } from "./order.mjs";

const fieldLabels = [
  "CALLSIGN",
  "ALTITUDE / VS",
  "TYPE",
  "HEADING / SPEED",
  "SQUAWK",
  "",
  "BEARING / RANGE",
  "ORIGIN",
  "DESTINATION",
];
function buildFlightStripData(aircraft, width) {
  const sorted = orderFlightStripAircraft(aircraft);
  const values = sorted.map(valuesOf);
  const layout = buildFlightStripLayout(values, width, fieldLabels);
  return {
    rowCount: layout.rowCount,
    aircraft: sorted.map((item, index) => ({
      icao: item.icao ?? "",
      lastSeen: item.lastSeen,
      remoteOnly: item.remoteOnly === true,
      emergency: Boolean(getAircraftEmergencyLabel(item)),
      nearHomePass: Boolean(item.nearHomePass),
      ...layout.rows[index],
    })),
    weights: layout.alignedGroups.map((group) => group.map(() => 1)),
    count: sorted.length,
  };
}
export default buildFlightStripData;
