import { aircraftDivider } from "./frame.mjs";
import { tableRow } from "./table.mjs";

export function renderAircraftRows(rows, layout, width) {
  const lines = [];
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
  return lines;
}
