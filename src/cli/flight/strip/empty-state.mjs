import { flightStripTitleWidth } from "./title/width.mjs";
import { tableRow } from "./table/row.mjs";

export function renderFlightStripEmptyState(widths) {
  return tableRow(["Waiting for aircraft..."], [flightStripTitleWidth(widths)]);
}
