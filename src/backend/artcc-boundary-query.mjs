import { default as groupBoundaries } from "./artcc-boundary/group.mjs";
import { default as createArtccBoundaryRangeFilter } from "./artcc-boundary/range.mjs";

export const ARTCC_POINTS = `SELECT LOCATION_ID AS locationId, LOCATION_NAME AS name,
  ALTITUDE AS altitude, TYPE AS type, POINT_SEQ AS sequence,
  CAST(LAT_DECIMAL AS REAL) AS latitude, CAST(LONG_DECIMAL AS REAL) AS longitude
  FROM ARB_SEG WHERE TYPE = 'ARTCC'
  ORDER BY LOCATION_ID, ALTITUDE, TYPE, CAST(POINT_SEQ AS INTEGER)`;

function createArtccBoundaryQuery(database) {
  const points = database.prepare(ARTCC_POINTS);
  let boundaries;
  let indexedLocation;
  let rangeFilters;
  return (location, minRangeNm, maxRangeNm) => {
    boundaries ??= groupBoundaries(points.all());
    const locationKey = `${location.latitude}:${location.longitude}`;
    if (locationKey !== indexedLocation) {
      indexedLocation = locationKey;
      rangeFilters = [...boundaries.values()].map((boundary) => ({
        boundary,
        includesRange: createArtccBoundaryRangeFilter(boundary.points, location),
      }));
    }
    return rangeFilters
      .filter(({ includesRange }) => includesRange(minRangeNm, maxRangeNm))
      .map(({ boundary }) => ({
        ...boundary,
        id: `${boundary.locationId}:${boundary.altitude}:${boundary.type}`,
      }));
  };
}
export default createArtccBoundaryQuery;
