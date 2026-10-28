import { flightStripColumns } from "./columns.mjs";

export function flightStripTableWidth(widths) {
  return widths.reduce((sum, width) => sum + width, 0) + 3 * widths.length + 1;
}

export function flightStripGroupTableWidth(groups, widths) {
  return Math.max(
    ...groups.map((group) => flightStripTableWidth(group.map((index) => widths[index]))),
  );
}

const fullWidths = flightStripColumns.map(([, , width]) => width);
export const wideTableWidth = flightStripTableWidth(fullWidths);
