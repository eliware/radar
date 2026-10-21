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

export function buildFlightStripLayout(values, width, labels) {
  const indexes = labels.map((_, index) => index);
  const groups =
    width >= requiredWidth(indexes, values, indexes.length)
      ? [indexes]
      : Math.max(...twoRows.map((group) => requiredWidth(group, values, 5))) <= width
        ? twoRows
        : threeRows;
  const visibleGroups =
    groups.length === 3 ? groups : groups.map((group) => group.filter((i) => i !== 5));
  const columnCount = Math.max(...visibleGroups.map((group) => group.length));
  const alignedGroups = visibleGroups.map((group) =>
    Array.from({ length: columnCount }, (_, index) => group[index] ?? null),
  );
  return {
    rowCount: groups.length,
    alignedGroups,
    rows: values.map((row) => ({
      groups: alignedGroups.map((group) =>
        group.map((field) => (field === null ? "" : row[field])),
      ),
      labels: alignedGroups.map((group) =>
        group.map((field) => (field === null ? "" : labels[field])),
      ),
    })),
  };
}
