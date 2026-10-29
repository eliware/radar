import { calculateFlightStripWidths } from "../calculate-widths.mjs";

export function allocateFlightStripLayoutWidths(groups, minimums, terminalWidth) {
  return groups.map((indices) => calculateFlightStripWidths(indices, minimums, terminalWidth));
}
