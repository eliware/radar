import { flightStripColumns } from "./columns.mjs";

export { flightStripColumns } from "./columns.mjs";

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
