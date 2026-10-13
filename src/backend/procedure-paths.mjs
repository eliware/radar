export function createProcedurePaths(rows) {
  const paths = new Map();
  for (const row of rows) {
    const id = pathId(row);
    const path = paths.get(id) ?? { ...pathFields(row), id, points: [] };
    path.points.push(pointFromRow(row));
    paths.set(id, path);
  }
  const result = [...paths.values()];
  labelSidEnds(result.filter((path) => path.type === "SID"));
  labelStarEntryFixes(result.filter((path) => path.type === "STAR"));
  return result.filter((path) => path.points.length > 1);
}

function pathId(row) {
  return [
    row.type,
    row.code,
    row.portionType,
    row.routeName,
    row.bodySequence,
    row.transitionCode,
    row.runwayAssociation,
  ].join(":");
}

function pathFields(row) {
  return {
    type: row.type,
    name: row.name,
    code: row.code,
    airportId: row.airportId,
    airportLatitude: row.airportLatitude,
    airportLongitude: row.airportLongitude,
    portionType: row.portionType,
    routeName: row.routeName,
    transitionCode: row.transitionCode,
  };
}

function pointFromRow(row) {
  return {
    sequence: row.sequence,
    fix: row.fix.trim(),
    fixType: row.fixType.trim(),
    latitude: row.latitude,
    longitude: row.longitude,
    label: false,
  };
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
