import { createFlightStripLayout, tableRow, wideTableWidth } from "./strip/layout.mjs";
import { aircraftDivider, flightStripFooter, flightStripHeader } from "./strip/frame.mjs";
import { aircraftValuesOf } from "./strip/aircraft-values.mjs";

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
    if (index < rows.length - 1) {
      lines.push(aircraftDivider(layout, width));
    }
  }
}

function renderTable(aircraft, width, now) {
  const rows = aircraft.map((item) => aircraftValuesOf(item, now()));
  const layout = createFlightStripLayout(width, rows);
  const widths = layout[0].widths;
  const lines = flightStripHeader(layout, aircraft.length, width);
  if (rows.length) renderAircraft(rows, layout, lines, width);
  else {
    const titleWidth = widths.reduce((sum, width) => sum + width, 3 * widths.length - 3);
    lines.push(tableRow(["Waiting for aircraft..."], [titleWidth]));
  }
  lines.push(flightStripFooter(layout, width));
  return lines;
}

export function renderFlightStrips(
  aircraft,
  { now = Date.now, clearScreen = true, width = wideTableWidth } = {},
) {
  const lines = clearScreen ? ["\u001b[2J\u001b[H"] : [];
  const terminalWidth = Math.max(20, Number.isFinite(width) ? width : wideTableWidth);
  lines.push(...renderTable(aircraft, terminalWidth, now));
  return lines.join("\n");
}
