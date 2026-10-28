import { tableBorder } from "./table.mjs";
import { horizontalRule } from "./rule.mjs";

export function flightStripFooter(layout, width) {
  return layout.length === 1
    ? tableBorder(layout[0].widths, "╚", "╧", "╝", "═")
    : horizontalRule(width, "╚", "╝", "═");
}
