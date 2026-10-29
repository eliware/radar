import { flightStripColumns } from "./columns.mjs";
import { selectFlightStripHeaders } from "./headers.mjs";
import { flightStripGroupTableWidth } from "./group-table-width.mjs";
import { minimumFlightStripWidths } from "./minimum-widths.mjs";
import { flightStripTableWidth, wideTableWidth } from "./table/width.mjs";
import { allocateFlightStripLayoutWidths } from "./layout/widths.mjs";

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
  const widths = allocateFlightStripLayoutWidths(groups, minimums, width);
  return groups.map((indices, groupIndex) => ({
    indices,
    labels: indices.map((index) => labels[index]),
    widths: widths[groupIndex],
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
