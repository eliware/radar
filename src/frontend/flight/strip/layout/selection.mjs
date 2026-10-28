const twoRows = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8],
];
const threeRows = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
];

function requiredWidth(group, values, columns) {
  const chars = Math.max(4, ...group.flatMap((index) => values.map((row) => row[index].length)));
  return columns * (chars * 8 + 10);
}

export function selectFlightStripLayout(values, width, labels) {
  const indexes = labels.map((_, index) => index);
  if (width >= requiredWidth(indexes, values, indexes.length)) return [indexes];
  return Math.max(...twoRows.map((group) => requiredWidth(group, values, 5))) <= width
    ? twoRows
    : threeRows;
}
