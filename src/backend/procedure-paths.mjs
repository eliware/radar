import { labelProcedurePaths } from "./label-procedure-paths.mjs";

export function createProcedurePaths(rows) {
  const paths = new Map();
  for (const row of rows) {
    const id = pathId(row);
    const path = paths.get(id) ?? { ...pathFields(row), id, points: [] };
    path.points.push(pointFromRow(row));
    paths.set(id, path);
  }
  const result = [...paths.values()];
  labelProcedurePaths(result);
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
