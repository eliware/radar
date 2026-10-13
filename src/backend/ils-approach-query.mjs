import { distanceNauticalMiles } from "../shared/distance-nautical-miles.mjs";

export const ILS_APPROACH_QUERY = `SELECT I.ARPT_ID AS faaId, I.RWY_END_ID AS runwayEnd,
  I.ILS_LOC_ID AS identifier, I.SYSTEM_TYPE_CODE AS systemType, I.CATEGORY AS category,
  I.COMPONENT_STATUS AS status, CAST(I.APCH_BEAR AS REAL) AS magneticCourse,
  CAST(I.MAG_VAR AS REAL) AS magneticVariation, I.MAG_VAR_HEMIS AS magneticVariationHemisphere,
  COALESCE(CAST(G.LAT_DECIMAL AS REAL), CAST(I.LAT_DECIMAL AS REAL)) AS latitude,
  COALESCE(CAST(G.LONG_DECIMAL AS REAL), CAST(I.LONG_DECIMAL AS REAL)) AS longitude,
  COALESCE(CAST(G.SITE_ELEVATION AS REAL), CAST(I.SITE_ELEVATION AS REAL)) AS elevationFeet,
  CAST(G.G_S_ANGLE AS REAL) AS glideSlopeDegrees
  FROM ILS_BASE I LEFT JOIN ILS_GS G ON G.EFF_DATE = I.EFF_DATE AND G.SITE_NO = I.SITE_NO
  AND G.ARPT_ID = I.ARPT_ID AND G.RWY_END_ID = I.RWY_END_ID AND G.ILS_LOC_ID = I.ILS_LOC_ID
  WHERE I.COMPONENT_STATUS LIKE 'OPERATIONAL%'
  AND COALESCE(CAST(G.LAT_DECIMAL AS REAL), CAST(I.LAT_DECIMAL AS REAL)) BETWEEN ? AND ?
  AND COALESCE(CAST(G.LONG_DECIMAL AS REAL), CAST(I.LONG_DECIMAL AS REAL)) BETWEEN ? AND ?`;

export function createIlsApproachQuery(database) {
  const statement = database.prepare(ILS_APPROACH_QUERY);
  return (location, minRangeNm, maxRangeNm) => {
    const latDelta = maxRangeNm / 60;
    const lonDelta =
      maxRangeNm / (60 * Math.max(0.01, Math.cos((location.latitude * Math.PI) / 180)));
    return statement
      .all(
        Math.max(-90, location.latitude - latDelta),
        Math.min(90, location.latitude + latDelta),
        Math.max(-180, location.longitude - lonDelta),
        Math.min(180, location.longitude + lonDelta),
      )
      .flatMap((row) => mapApproach(row, location, minRangeNm, maxRangeNm));
  };
}

function mapApproach(row, location, minRangeNm, maxRangeNm) {
  if (!Number.isFinite(row.latitude) || !Number.isFinite(row.longitude)) return [];
  const rangeNm = distanceNauticalMiles(location, row);
  if (rangeNm < minRangeNm || (minRangeNm > 0 && rangeNm <= minRangeNm) || rangeNm > maxRangeNm)
    return [];
  return [{ ...row, rangeNm }];
}
