import { formatAircraftSpeed, formatAircraftTag } from "./aircraft-tag-data.mjs";

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
const twoRows = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8],
];
const threeRows = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
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

function requiredWidth(group, values, columns) {
  const chars = Math.max(4, ...group.flatMap((index) => values.map((row) => row[index].length)));
  return columns * (chars * 8 + 10);
}

export function buildFlightStripData(aircraft, width) {
  const sorted = [...aircraft].sort(
    (left, right) =>
      (left.distanceNauticalMiles ?? Infinity) - (right.distanceNauticalMiles ?? Infinity),
  );
  const values = sorted.map(valuesOf);
  const indexes = fieldLabels.map((_, index) => index);
  const groups =
    width >= requiredWidth(indexes, values, indexes.length)
      ? [indexes]
      : Math.max(...twoRows.map((group) => requiredWidth(group, values, 5))) <= width
        ? twoRows
        : threeRows;
  const columnCount = Math.max(...groups.map((group) => group.length));
  const alignedGroups = groups.map((group) =>
    Array.from({ length: columnCount }, (_, index) => group[index] ?? null),
  );
  return {
    aircraft: sorted.map((item, row) => ({
      icao: item.icao ?? "",
      groups: alignedGroups.map((group) =>
        group.map((field) => (field === null ? "" : values[row][field])),
      ),
      labels: alignedGroups.map((group) =>
        group.map((field) => (field === null ? "" : fieldLabels[field])),
      ),
    })),
    weights: alignedGroups.map((group) => group.map(() => 1)),
    count: sorted.length,
  };
}
