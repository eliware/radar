const fields = [
  ["callsign", "CALLSIGN", "CALL", 10, 6],
  ["icao", "ICAO", "ICAO", 8, 6],
  ["altitudeFeet", "ALTITUDE", "ALT", 12, 6],
  ["groundSpeedKnots", "SPEED", "SPD", 9, 5],
  ["trackDegrees", "HEADING", "HDG", 9, 5],
  ["verticalRateFeetPerMinute", "VERTICAL RATE", "VS", 14, 5],
  ["squawk", "SQUAWK", "SQ", 8, 4],
  ["position", "POSITION", "POS", 24, 18],
  ["distanceNauticalMiles", "RANGE NM", "RNG", 12, 6],
  ["bearingDegrees", "BEARING", "BRG", 9, 4],
  ["age", "AGE", "AGE", 7, 4],
];
const twoRows = [
  [0, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
];
const threeRows = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10],
];

function valueOf(aircraft, index, now) {
  const [key] = fields[index];
  const value = aircraft[key];
  if (key === "position")
    return Number.isFinite(aircraft.latitude) && Number.isFinite(aircraft.longitude)
      ? `${aircraft.latitude.toFixed(4)}, ${aircraft.longitude.toFixed(4)}`
      : "-";
  if (key === "age")
    return `${Number.isFinite(aircraft.lastSeen) ? Math.max(0, Math.floor((now - aircraft.lastSeen) / 1000)) : 0}s`;
  if (value === null || value === undefined || value === "") return "-";
  if (key === "altitudeFeet") return `${value.toLocaleString("en-US")} ft`;
  if (key === "groundSpeedKnots") return `${value} kt`;
  if (key === "trackDegrees" || key === "bearingDegrees")
    return `${String(value).padStart(3, "0")}°`;
  if (key === "verticalRateFeetPerMinute") return `${value} fpm`;
  if (key === "distanceNauticalMiles") return `${value} nm`;
  return String(value);
}

function requiredWidth(indices, widths, values) {
  return indices.reduce(
    (sum, index) =>
      sum + Math.max(widths[index], ...values.map((row) => row[index].length)) * 8 + 12,
    12,
  );
}

export function buildFlightStripData(aircraft, width, now) {
  const sorted = [...aircraft].sort(
    (left, right) =>
      (left.distanceNauticalMiles ?? Infinity) - (right.distanceNauticalMiles ?? Infinity),
  );
  const values = sorted.map((item) => fields.map((_, index) => valueOf(item, index, now)));
  const fullWidths = fields.map((field) => field[3]);
  const shortWidths = fields.map((field, index) =>
    Math.max(field[4], ...values.map((row) => row[index].length)),
  );
  const indexes = fields.map((_, index) => index);
  const required = (group, widths) => requiredWidth(group, widths, values);
  const groups =
    width >= required(indexes, fullWidths)
      ? [indexes]
      : width >= required(indexes, shortWidths)
        ? [indexes]
        : Math.max(...twoRows.map((group) => required(group, shortWidths))) <= width
          ? twoRows
          : threeRows;
  const full = groups.length === 1 && width >= required(indexes, fullWidths);
  const minWidths = full
    ? fields.map((field, index) => Math.max(field[3], ...values.map((row) => row[index].length)))
    : shortWidths;
  return {
    aircraft: sorted.map((item, index) => ({
      icao: item.icao ?? "",
      groups: groups.map((group) => group.map((field) => values[index][field])),
    })),
    headers: groups.map((group) => group.map((field) => fields[field][full ? 1 : 2])),
    weights: groups.map((group) => group.map((field) => minWidths[field])),
    count: sorted.length,
  };
}
