import { PAVED_SURFACES } from "../../sql-query-rules.mjs";

export const RUNWAY_QUERY = `WITH selected_airports AS (
  SELECT value AS airportId FROM json_each(?)
  ) SELECT E.ARPT_ID AS airportId, E.RWY_ID AS runwayId, E.RWY_END_ID AS endId,
  CAST(E.LAT_DECIMAL AS REAL) AS latitude, CAST(E.LONG_DECIMAL AS REAL) AS longitude,
  CAST(NULLIF(E.RWY_END_ELEV, '') AS REAL) AS elevationFeet,
  CAST(E.TRUE_ALIGNMENT AS REAL) AS alignmentDegrees FROM APT_RWY_END E
  JOIN APT_RWY R ON R.ARPT_ID = E.ARPT_ID AND R.RWY_ID = E.RWY_ID
  JOIN selected_airports S ON S.airportId = E.ARPT_ID
  WHERE R.SURFACE_TYPE_CODE IN (${PAVED_SURFACES})
  AND CAST(R.RWY_LEN AS REAL) > 1000`;
