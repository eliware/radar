import { distanceNauticalMiles } from "../shared/distance-nautical-miles.mjs";

const NEARBY_POINTS = `SELECT LOCATION_ID AS locationId, LOCATION_NAME AS name,
  ALTITUDE AS altitude, TYPE AS type, POINT_SEQ AS sequence,
  CAST(LAT_DECIMAL AS REAL) AS latitude, CAST(LONG_DECIMAL AS REAL) AS longitude
  FROM ARB_SEG WHERE TYPE = 'ARTCC' AND CAST(LAT_DECIMAL AS REAL) BETWEEN ? AND ?
  AND CAST(LONG_DECIMAL AS REAL) BETWEEN ? AND ?`;
const ALL_POINTS = `SELECT POINT_SEQ AS sequence, CAST(LAT_DECIMAL AS REAL) AS latitude,
  CAST(LONG_DECIMAL AS REAL) AS longitude FROM ARB_SEG
  WHERE LOCATION_ID = ? AND ALTITUDE = ? AND TYPE = ? ORDER BY CAST(POINT_SEQ AS INTEGER)`;

export function createArtccBoundaryQuery(database) {
  const nearby = database.prepare(NEARBY_POINTS);
  const fullBoundary = database.prepare(ALL_POINTS);
  return (location, minRangeNm, maxRangeNm) => {
    const keys = new Map();
    for (const row of nearby.all(...bounds(location, maxRangeNm))) {
      const range = distanceNauticalMiles(location, row);
      if (range > maxRangeNm || (minRangeNm > 0 && range <= minRangeNm)) continue;
      keys.set(`${row.locationId}:${row.altitude}:${row.type}`, row);
    }
    return [...keys.values()].map((row) => ({
      id: `${row.locationId}:${row.altitude}:${row.type}`,
      locationId: row.locationId,
      name: row.name,
      altitude: row.altitude,
      type: row.type,
      points: fullBoundary.all(row.locationId, row.altitude, row.type),
    }));
  };
}

function bounds(location, rangeNm) {
  const latDelta = rangeNm / 60;
  const lonDelta = rangeNm / (60 * Math.max(0.01, Math.cos((location.latitude * Math.PI) / 180)));
  return [
    Math.max(-90, location.latitude - latDelta),
    Math.min(90, location.latitude + latDelta),
    Math.max(-180, location.longitude - lonDelta),
    Math.min(180, location.longitude + lonDelta),
  ];
}
