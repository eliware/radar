import { tableBorder, tableRow } from "./table.mjs";
import { horizontalRule } from "./rule.mjs";
import { flightStripTitle } from "./title.mjs";

export function flightStripHeader(layout, aircraftCount, width) {
  const widths = layout[0].widths;
  const { lines, splitAfter } = flightStripTitle(widths, aircraftCount, width);
  lines.push(tableBorder(widths, "╠", "╤", "╣", "═", splitAfter));
  for (const [index, group] of layout.entries()) {
    if (index > 0) lines.push(horizontalRule(width, "╟", "╢", "─"));
    lines.push(tableRow(group.labels, group.widths, "║", "│", "║"));
  }
  lines.push(
    layout.length === 1
      ? tableBorder(widths, "╠", "╪", "╣", "═")
      : horizontalRule(width, "╠", "╣", "═"),
  );
  return lines;
}

export function aircraftDivider(layout, width) {
  return layout.length === 1
    ? tableBorder(layout[0].widths, "╟", "┼", "╢", "─")
    : horizontalRule(width, "╟", "╢", "─");
}

export function flightStripFooter(layout, width) {
  return layout.length === 1
    ? tableBorder(layout[0].widths, "╚", "╧", "╝", "═")
    : horizontalRule(width, "╚", "╝", "═");
}
