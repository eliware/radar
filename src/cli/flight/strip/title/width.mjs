export function flightStripTitleWidth(widths) {
  return widths.reduce((sum, width) => sum + width, 3 * widths.length - 3);
}
