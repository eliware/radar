import { flightStripFooter, flightStripHeader } from "./frame.mjs";
import { renderAircraftRows } from "./aircraft-rows.mjs";
import { tableRow } from "./table.mjs";

export function renderFlightStripFrame(rows, layout, aircraftCount, width) {
  const widths = layout[0].widths;
  const lines = [
    ...flightStripHeader(layout, aircraftCount, width),
    ...renderAircraftRows(rows, layout, width),
  ];
  if (!rows.length) {
    const titleWidth = widths.reduce((sum, width) => sum + width, 3 * widths.length - 3);
    lines.push(tableRow(["Waiting for aircraft..."], [titleWidth]));
  }
  lines.push(flightStripFooter(layout, width));
  return lines;
}
