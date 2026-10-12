import { DatabaseSync } from "node:sqlite";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { distanceNauticalMiles } from "../shared/distance-nautical-miles.mjs";
import { createArtccBoundaryQuery } from "./artcc-boundary-query.mjs";
import { AIRPORT_QUERY, NAVAID_QUERY, RUNWAY_QUERY } from "./airport-database-queries.mjs";

const DEFAULT_PATH = "artifacts/nasr/NASR_2026_10_01.sqlite";

export function createAirportDatabase(path, { Database = DatabaseSync, exists = existsSync } = {}) {
  const file = resolve(path || DEFAULT_PATH);
  if (!exists(file)) {
    if (path) throw new Error(`NASR database file not found: ${file}`);
    return null;
  }
  const database = new Database(file, { readOnly: true });
  const statement = database.prepare(AIRPORT_QUERY);
  const runwayStatement = database.prepare(RUNWAY_QUERY);
  const navaidStatement = database.prepare(NAVAID_QUERY);
  const findBoundaries = createArtccBoundaryQuery(database);
  return {
    findBetween(location, minRangeNm, maxRangeNm) {
      const rows = rowsBetween(statement, location, maxRangeNm);
      return rows.flatMap((row) => {
        const airport = mapAirport(row, location, minRangeNm, maxRangeNm);
        return airport
          ? [{ ...airport, runways: groupRunwayEnds(runwayStatement.all(row.faaId)) }]
          : [];
      });
    },
    findNavaidsBetween(location, minRangeNm, maxRangeNm) {
      return rowsBetween(navaidStatement, location, maxRangeNm).flatMap((row) =>
        mapNavaid(row, location, minRangeNm, maxRangeNm),
      );
    },
    findBoundariesBetween: findBoundaries,
    close: () => database.close(),
  };
}

function rowsBetween(statement, location, maxRangeNm) {
  const latitudeDelta = maxRangeNm / 60;
  const longitudeDelta =
    maxRangeNm / (60 * Math.max(0.01, Math.cos((location.latitude * Math.PI) / 180)));
  return statement.all(
    Math.max(-90, location.latitude - latitudeDelta),
    Math.min(90, location.latitude + latitudeDelta),
    Math.max(-180, location.longitude - longitudeDelta),
    Math.min(180, location.longitude + longitudeDelta),
  );
}

function mapAirport(row, location, minRangeNm, maxRangeNm) {
  if (!Number.isFinite(row.latitude) || !Number.isFinite(row.longitude)) return null;
  const rangeNm = distanceNauticalMiles(location, row);
  if (rangeNm < minRangeNm || (minRangeNm > 0 && rangeNm <= minRangeNm) || rangeNm > maxRangeNm) {
    return null;
  }
  return { ...row, rangeNm };
}

function mapNavaid(row, location, minRangeNm, maxRangeNm) {
  const mapped = mapAirport(row, location, minRangeNm, maxRangeNm);
  return mapped ? [mapped] : [];
}

function groupRunwayEnds(ends) {
  const groups = new Map();
  for (const end of ends) {
    if (!Number.isFinite(end.latitude) || !Number.isFinite(end.longitude)) continue;
    if (!Number.isFinite(end.alignmentDegrees)) continue;
    const group = groups.get(end.runwayId) ?? [];
    group.push(end);
    groups.set(end.runwayId, group);
  }
  return [...groups.values()].filter((group) => group.length === 2);
}
