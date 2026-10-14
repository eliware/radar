export function labelProcedurePaths(paths) {
  labelSidEnds(paths.filter((path) => path.type === "SID"));
  labelStarEntryFixes(paths.filter((path) => path.type === "STAR"));
}

function labelSidEnds(paths) {
  for (const path of paths) path.points.at(-1).label = true;
}

function labelStarEntryFixes(paths) {
  const transitions = paths.filter((path) => path.portionType === "TRANSITION");
  for (const path of transitions) path.points[0].label = true;
  const bodies = paths.filter((path) => path.portionType === "BODY");
  for (const path of bodies) path.points.at(-1).label = true;
  for (const [_code, pathsForProcedure] of groupByCode(bodies)) {
    const mainFix = commonMainFix(pathsForProcedure);
    for (const path of pathsForProcedure) {
      const point = path.points.find((entry) => entry.fix === mainFix);
      if (point) point.label = true;
    }
  }
}

function groupByCode(paths) {
  const groups = new Map();
  for (const path of paths) groups.set(path.code, [...(groups.get(path.code) ?? []), path]);
  return groups;
}

function commonMainFix(paths) {
  const counts = new Map();
  for (const path of paths) {
    for (const point of path.points.slice(1))
      counts.set(point.fix, (counts.get(point.fix) ?? 0) + 1);
  }
  const first = [...counts].sort((left, right) => right[1] - left[1])[0];
  return first ? first[0] : null;
}
