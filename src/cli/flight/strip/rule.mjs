export function horizontalRule(width, left, right, line) {
  return `${left}${line.repeat(width - 2)}${right}`;
}
