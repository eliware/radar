import { flightStripColumns } from "./columns.mjs";
import { selectFlightStripHeaders } from "./headers.mjs";
import { calculateFlightStripWidths } from "./calculate-widths.mjs";
import { flightStripGroupTableWidth } from "./group-table-width.mjs";
import { minimumFlightStripWidths } from "./minimum-widths.mjs";
import { flightStripTableWidth, wideTableWidth } from "./table/width.mjs";

export function createFlightStripLayout(width, values = []) {
  const full = width >= wideTableWidth;
  const labels = selectFlightStripHeaders(full);
  const minimums = minimumFlightStripWidths(full, values);
  const oneLineWidth = full ? wideTableWidth : flightStripTableWidth(minimums);
  let groups = [flightStripColumns.map((_, index) => index)];
  if (!full && width < oneLineWidth) {
    groups =
      width >= flightStripGroupTableWidth(twoLineGroups, minimums)
        ? twoLineGroups
        : threeLineGroups;
  }
  return groups.map((indices) => ({
    indices,
    labels: indices.map((index) => labels[index]),
    widths: calculateFlightStripWidths(indices, minimums, width),
  }));
}

const twoLineGroups = [
  [0, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
];
const threeLineGroups = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10],
];
