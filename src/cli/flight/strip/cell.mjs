export function fitCell(value, width, suffix = "", align = "left") {
  const text = value === null || value === undefined ? "-" : `${value}${suffix}`;
  if (text.length > width) return `${text.slice(0, width - 1)}…`;
  return align === "right" ? text.padStart(width) : text.padEnd(width);
}
