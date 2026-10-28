import { flightStripTableWidth } from "./table/width.mjs";

export function flightStripGroupTableWidth(groups, widths) {
  return Math.max(
    ...groups.map((group) => flightStripTableWidth(group.map((index) => widths[index]))),
  );
}
