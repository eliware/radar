export function buildFlightStripRows(values, labels, groups) {
  const visibleGroups =
    groups.length === 3 ? groups : groups.map((group) => group.filter((index) => index !== 5));
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
