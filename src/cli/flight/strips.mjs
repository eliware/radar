import { createFlightStripLayout, wideTableWidth } from "./strip/layout.mjs";
import { aircraftRowsOf } from "./strip/rows.mjs";
import { renderFlightStripFrame } from "./strip/render.mjs";

export function renderFlightStrips(
  aircraft,
  { now = Date.now, clearScreen = true, width = wideTableWidth } = {},
) {
  const lines = clearScreen ? ["\u001b[2J\u001b[H"] : [];
  const terminalWidth = Math.max(20, Number.isFinite(width) ? width : wideTableWidth);
  const rows = aircraftRowsOf(aircraft, now);
  const layout = createFlightStripLayout(terminalWidth, rows);
  lines.push(...renderFlightStripFrame(rows, layout, aircraft.length, terminalWidth));
  return lines.join("\n");
}
