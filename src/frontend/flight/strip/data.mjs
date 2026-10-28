import { buildFlightStripLayout } from "./layout.mjs";
import { getAircraftEmergencyLabel } from "../../../shared/aircraft/emergency.mjs";
import { valuesOf } from "./values.mjs";

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
export function buildFlightStripData(aircraft, width) {
  const sorted = [...aircraft].sort(
    (left, right) =>
      (left.distanceNauticalMiles ?? Infinity) - (right.distanceNauticalMiles ?? Infinity),
  );
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
