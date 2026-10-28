import { flightStripColumns } from "../columns.mjs";

export function flightStripTableWidth(widths) {
  return widths.reduce((sum, width) => sum + width, 0) + 3 * widths.length + 1;
}

const fullWidths = flightStripColumns.map(([, , width]) => width);
export const wideTableWidth = flightStripTableWidth(fullWidths);
