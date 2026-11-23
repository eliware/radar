import { default as buildFlightStripRows } from "./layout/rows.mjs";
import { default as selectFlightStripLayout } from "./layout/selection.mjs";

function buildFlightStripLayout(values, width, labels) {
  return buildFlightStripRows(values, labels, selectFlightStripLayout(values, width, labels));
}
export default buildFlightStripLayout;
