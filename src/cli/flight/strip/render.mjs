import { flightStripHeader } from "./frame.mjs";
import { flightStripFooter } from "./frame-formatting.mjs";
import { renderAircraftRows } from "./aircraft-rows.mjs";
import { renderFlightStripEmptyState } from "./empty-state.mjs";

export function renderFlightStripFrame(rows, layout, aircraftCount, width) {
  const widths = layout[0].widths;
  const lines = [
    ...flightStripHeader(layout, aircraftCount, width),
    ...renderAircraftRows(rows, layout, width),
  ];
  if (!rows.length) {
    lines.push(renderFlightStripEmptyState(widths));
  }
  lines.push(flightStripFooter(layout, width));
  return lines;
}
