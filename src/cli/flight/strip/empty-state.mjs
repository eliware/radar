import { flightStripTitleWidth } from "./sizing.mjs";
import { tableRow } from "./table.mjs";

export function renderFlightStripEmptyState(widths) {
  return tableRow(["Waiting for aircraft..."], [flightStripTitleWidth(widths)]);
}
