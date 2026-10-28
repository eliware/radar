import { groupBoundaries } from "./artcc-boundary/group.mjs";
import { intersectsRange } from "./artcc-boundary/range.mjs";

export const ARTCC_POINTS = `SELECT LOCATION_ID AS locationId, LOCATION_NAME AS name,
  ALTITUDE AS altitude, TYPE AS type, POINT_SEQ AS sequence,
  CAST(LAT_DECIMAL AS REAL) AS latitude, CAST(LONG_DECIMAL AS REAL) AS longitude
  FROM ARB_SEG WHERE TYPE = 'ARTCC'
  ORDER BY LOCATION_ID, ALTITUDE, TYPE, CAST(POINT_SEQ AS INTEGER)`;

export function createArtccBoundaryQuery(database) {
  const points = database.prepare(ARTCC_POINTS);
  let boundaries;
  return (location, minRangeNm, maxRangeNm) => {
    boundaries ??= groupBoundaries(points.all());
    return [...boundaries.values()]
      .filter((boundary) => intersectsRange(boundary.points, location, minRangeNm, maxRangeNm))
      .map((boundary) => ({
        ...boundary,
        id: `${boundary.locationId}:${boundary.altitude}:${boundary.type}`,
      }));
  };
}
