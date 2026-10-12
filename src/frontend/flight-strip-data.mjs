import { formatAircraftTag } from "./aircraft-tag-data.mjs";

const fieldLabels = ["CALLSIGN", "ALTITUDE / VS", "SPEED", "HEADING", "SQUAWK", "RANGE", "BEARING"];
const twoRows = [
  [0, 1, 2, 3],
  [4, 5, 6],
];
const threeRows = [
  [0, 1, 2],
  [3, 4],
  [5, 6],
];

function valuesOf(aircraft) {
  const [callsign, altitude, speed] = formatAircraftTag(aircraft);
  return [
    callsign,
    altitude,
    speed,
    Number.isFinite(aircraft.trackDegrees)
      ? `${String(aircraft.trackDegrees).padStart(3, "0")}°`
      : "-",
    aircraft.squawk || "-",
    Number.isFinite(aircraft.distanceNauticalMiles) ? String(aircraft.distanceNauticalMiles) : "-",
    Number.isFinite(aircraft.bearingDegrees)
      ? `${String(aircraft.bearingDegrees).padStart(3, "0")}°`
      : "-",
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
      : Math.max(...twoRows.map((group) => requiredWidth(group, values, 4))) <= width
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
