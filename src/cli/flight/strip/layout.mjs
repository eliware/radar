import { flightStripColumns } from "./columns.mjs";
import { calculateFlightStripWidths, minimumFlightStripWidths } from "./widths.mjs";
import {
  flightStripGroupTableWidth,
  flightStripTableWidth,
  wideTableWidth,
} from "./table-widths.mjs";

export { flightStripColumns } from "./columns.mjs";

export { wideTableWidth };
const twoLineGroups = [
  [0, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
];
const threeLineGroups = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10],
];

export function createFlightStripLayout(width, values = []) {
  const full = width >= wideTableWidth;
  const labels = flightStripColumns.map(([longName, shortName]) => (full ? longName : shortName));
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
