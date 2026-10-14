import { distanceNauticalMiles } from "../shared/distance-nautical-miles.mjs";

export function selectProcedurePaths(paths, location, minRangeNm, maxRangeNm) {
  return paths.flatMap((path) => {
    const airportRangeNm = distanceNauticalMiles(location, {
      latitude: path.airportLatitude,
      longitude: path.airportLongitude,
    });
    const inBand =
      airportRangeNm <= maxRangeNm && (minRangeNm === 0 || airportRangeNm > minRangeNm);
    if (!inBand) return [];
    const points = path.points.map((point) => ({
      ...point,
      rangeNm: distanceNauticalMiles(location, point),
    }));
    return [{ ...path, airportRangeNm, points }];
  });
}
