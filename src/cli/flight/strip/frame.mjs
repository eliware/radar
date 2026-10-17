import { tableBorder, tableRow } from "./layout.mjs";

export function horizontalRule(width, left, right, line) {
  return `${left}${line.repeat(width - 2)}${right}`;
}

function titleSplitAfter(widths, tableWidth, countWidth) {
  const target = tableWidth - countWidth - 2;
  const candidates = widths.slice(1).map((_, index) => index + 1);
  const boundary = (count) => widths.slice(0, count).reduce((sum, width) => sum + width + 3, 0);
  return (
    candidates
      .filter((count) => tableWidth - boundary(count) - 2 >= countWidth)
      .sort(
        (left, right) => Math.abs(target - boundary(left)) - Math.abs(target - boundary(right)),
      )[0] ?? 1
  );
}

function titleLines(widths, aircraftCount, splitAfter) {
  const total = widths.reduce((sum, width) => sum + width, 3 * widths.length + 1);
  const titleWidth = widths.slice(0, splitAfter).reduce((sum, width) => sum + width + 3, 0) - 1;
  const countWidth = total - titleWidth - 3;
  const count = ` ${aircraftCount} AIRCRAFT `;
  const countCell =
    count.length > countWidth ? `${count.slice(0, countWidth - 1)}…` : count.padStart(countWidth);
  const title = " RADAR CLI".slice(0, titleWidth).padEnd(titleWidth);
  return [`╔${"═".repeat(titleWidth)}╤${"═".repeat(countWidth)}╗`, `║${title}│${countCell}║`];
}

export function flightStripHeader(layout, aircraftCount, width) {
  const widths = layout[0].widths;
  const countWidth = ` ${aircraftCount} AIRCRAFT `.length;
  const splitAfter = titleSplitAfter(widths, width, countWidth);
  const lines = titleLines(widths, aircraftCount, splitAfter);
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
