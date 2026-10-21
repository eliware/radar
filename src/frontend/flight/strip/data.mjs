import { formatAircraftSpeed, formatAircraftTag } from "../../aircraft/tag-data.mjs";
import { buildFlightStripLayout } from "./layout.mjs";
import { getAircraftEmergencyLabel } from "../../../shared/aircraft/emergency.mjs";

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
function valuesOf(aircraft) {
  const [callsign, altitude] = formatAircraftTag(aircraft);
  const speed = formatAircraftSpeed(aircraft);
  const heading = Number.isFinite(aircraft.trackDegrees)
    ? `${String(Math.round(aircraft.trackDegrees) % 360).padStart(3, "0")}°`
    : "-";
  const headingAndSpeed = heading === "-" && speed === "-" ? "-" : `${heading}${speed}`;
  const bearingAndRange =
    Number.isFinite(aircraft.distanceNauticalMiles) && Number.isFinite(aircraft.bearingDegrees)
      ? `${String(Math.round(aircraft.bearingDegrees) % 360).padStart(3, "0")}°${Math.round(aircraft.distanceNauticalMiles)}`
      : "-";
  return [
    callsign,
    altitude,
    aircraft.aircraftTypeCode || "-",
    headingAndSpeed,
    aircraft.squawk || "-",
    "",
    bearingAndRange,
    aircraft.origin || "-",
    aircraft.destination || "-",
  ];
}

export function buildFlightStripData(aircraft, width) {
  const sorted = [...aircraft].sort(
    (left, right) =>
      (left.distanceNauticalMiles ?? Infinity) - (right.distanceNauticalMiles ?? Infinity),
  );
  const values = sorted.map(valuesOf);
  const layout = buildFlightStripLayout(values, width, fieldLabels);
  return {
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
