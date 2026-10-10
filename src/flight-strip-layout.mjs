export const flightStripColumns = [
  ["CALLSIGN", "CALL", 10, 6],
  ["ICAO", "ICAO", 8, 6],
  ["ALTITUDE", "ALT", 12, 6],
  ["SPEED", "SPD", 9, 5],
  ["HEADING", "HDG", 9, 5],
  ["VERTICAL RATE", "VS", 14, 5],
  ["SQUAWK", "SQ", 8, 4],
  ["POSITION", "POS", 24, 18],
  ["RANGE NM", "RNG", 12, 6],
  ["BEARING", "BRG", 9, 4],
  ["AGE", "AGE", 7, 4],
];

const fullWidths = flightStripColumns.map(([, , width]) => width);
const shortWidths = flightStripColumns.map(([, , , width]) => width);
const fullTableWidth = (widths) =>
  widths.reduce((sum, width) => sum + width, 0) + 3 * widths.length + 1;
const groupTableWidth = (groups, widths) =>
  Math.max(...groups.map((group) => fullTableWidth(group.map((index) => widths[index]))));
export const wideTableWidth = fullTableWidth(fullWidths);
const twoLineGroups = [
  [0, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
];
const threeLineGroups = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10],
];

export function fitCell(value, width, suffix = "") {
  const text = value === null || value === undefined ? "-" : `${value}${suffix}`;
  return text.length > width ? `${text.slice(0, width - 1)}…` : text.padEnd(width);
}

function widthsFor(indices, minimums, tableWidth) {
  const available = tableWidth - (3 * indices.length + 1);
  const base = indices.map((index) => minimums[index]);
  if (base.reduce((sum, width) => sum + width, 0) > available) {
    const each = Math.floor(available / indices.length);
    return base.map((_, index) => each + (index < available % indices.length ? 1 : 0));
  }
  const extra = available - base.reduce((sum, width) => sum + width, 0);
  return base.map(
    (width, index) =>
      width + Math.floor(extra / base.length) + (index < extra % base.length ? 1 : 0),
  );
}

export function createFlightStripLayout(width, values = []) {
  const full = width >= wideTableWidth;
  const labels = flightStripColumns.map(([longName, shortName]) => (full ? longName : shortName));
  const minimums = full
    ? fullWidths
    : shortWidths.map((minimum, index) =>
        Math.max(minimum, ...values.map((row) => String(row[index] ?? "-").length)),
      );
  const oneLineWidth = full ? wideTableWidth : fullTableWidth(minimums);
  let groups = [flightStripColumns.map((_, index) => index)];
  if (!full && width < oneLineWidth) {
    groups = width >= groupTableWidth(twoLineGroups, minimums) ? twoLineGroups : threeLineGroups;
  }
  return groups.map((indices) => ({
    indices,
    labels: indices.map((index) => labels[index]),
    widths: widthsFor(indices, minimums, width),
  }));
}

export function tableBorder(widths, left, joint, right, line) {
  return `${left}${widths.map((width) => line.repeat(width + 2)).join(joint)}${right}`;
}

export function tableRow(values, widths, left = "║", joint = "║", right = "║") {
  return `${left} ${values.map((value, index) => fitCell(value, widths[index])).join(` ${joint} `)} ${right}`;
}
