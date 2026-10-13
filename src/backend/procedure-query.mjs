import { distanceNauticalMiles } from "../shared/distance-nautical-miles.mjs";
import { createProcedurePaths } from "./procedure-paths.mjs";
import { SID_QUERY, STAR_QUERY } from "./procedure-sql.mjs";

export function createProcedureQuery(database) {
  const sidStatement = database.prepare(SID_QUERY);
  const starStatement = database.prepare(STAR_QUERY);
  let paths;
  return (location, minRangeNm, maxRangeNm) => {
    paths ??= createProcedurePaths([...sidStatement.all(), ...starStatement.all()]);
    return paths.flatMap((path) => selectPath(path, location, minRangeNm, maxRangeNm));
  };
}

function selectPath(path, location, minRangeNm, maxRangeNm) {
  const airportRangeNm = distanceNauticalMiles(location, {
    latitude: path.airportLatitude,
    longitude: path.airportLongitude,
  });
  const inBand = airportRangeNm <= maxRangeNm && (minRangeNm === 0 || airportRangeNm > minRangeNm);
  const points = path.points.map((point) => {
    const rangeNm = distanceNauticalMiles(location, point);
    return { ...point, rangeNm };
  });
  return inBand ? [{ ...path, airportRangeNm, points }] : [];
}
