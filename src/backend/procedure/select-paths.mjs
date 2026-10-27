import { distanceNauticalMiles } from "../../shared/distance-nautical-miles.mjs";

const MAX_PROCEDURE_RANGE_NM = 300;

export function selectProcedurePaths(paths, location, minRangeNm, maxRangeNm) {
  return paths.flatMap((path) => {
    const airportRangeNm = distanceNauticalMiles(location, {
      latitude: path.airportLatitude,
      longitude: path.airportLongitude,
    });
    if (!inRange(airportRangeNm, minRangeNm, maxRangeNm)) return [];
    return [{ ...path, airportRangeNm, points: clipPoints(path.points, location) }];
  });
}

function inRange(rangeNm, minimum, maximum) {
  return rangeNm <= maximum && (minimum === 0 || rangeNm > minimum);
}

function clipPoints(points, location) {
  const result = [];
  for (const point of points) {
    const rangeNm = distanceNauticalMiles(location, point);
    if (rangeNm <= MAX_PROCEDURE_RANGE_NM) {
      result.push({ ...point, rangeNm });
      continue;
    }
    const previous = result.at(-1);
    if (previous) result.push(boundaryPoint(previous, point, rangeNm));
    break;
  }
  return result;
}

function boundaryPoint(previous, point, rangeNm) {
  const fraction = (MAX_PROCEDURE_RANGE_NM - previous.rangeNm) / (rangeNm - previous.rangeNm);
  return {
    ...point,
    latitude: previous.latitude + (point.latitude - previous.latitude) * fraction,
    longitude: previous.longitude + (point.longitude - previous.longitude) * fraction,
    rangeNm: MAX_PROCEDURE_RANGE_NM,
  };
}
