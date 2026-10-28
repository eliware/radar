import { buildFlightStripRows } from "./layout/rows.mjs";
import { selectFlightStripLayout } from "./layout/selection.mjs";

export function buildFlightStripLayout(values, width, labels) {
  return buildFlightStripRows(values, labels, selectFlightStripLayout(values, width, labels));
}
