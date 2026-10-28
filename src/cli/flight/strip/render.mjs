import { aircraftDivider, flightStripFooter, flightStripHeader } from "./frame.mjs";
import { tableRow } from "./table.mjs";

function renderAircraft(rows, layout, lines, width) {
  for (const [index, values] of rows.entries()) {
    for (const group of layout) {
      lines.push(
        tableRow(
          group.indices.map((column) => values[column]),
          group.widths,
          "║",
          "│",
          "║",
        ),
      );
    }
    if (index < rows.length - 1) lines.push(aircraftDivider(layout, width));
  }
}

export function renderFlightStripFrame(rows, layout, aircraftCount, width) {
  const widths = layout[0].widths;
  const lines = flightStripHeader(layout, aircraftCount, width);
  if (rows.length) renderAircraft(rows, layout, lines, width);
  else {
    const titleWidth = widths.reduce((sum, width) => sum + width, 3 * widths.length - 3);
    lines.push(tableRow(["Waiting for aircraft..."], [titleWidth]));
  }
  lines.push(flightStripFooter(layout, width));
  return lines;
}
