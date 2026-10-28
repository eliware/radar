import { flightStripTableWidth } from "./table/width.mjs";

export function calculateFlightStripWidths(indices, minimums, tableWidth) {
  const available = tableWidth - flightStripTableWidth(indices.map(() => 0));
  const base = indices.map((index) => minimums[index]);
  const baseWidth = base.reduce((sum, width) => sum + width, 0);
  if (baseWidth > available) {
    const each = Math.floor(available / indices.length);
    return base.map((_, index) => each + (index < available % indices.length ? 1 : 0));
  }
  const extra = available - baseWidth;
  return base.map(
    (width, index) =>
      width + Math.floor(extra / base.length) + (index < extra % base.length ? 1 : 0),
  );
}
