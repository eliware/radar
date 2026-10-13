const JOIN_POINT = `LEFT JOIN FIX_BASE F ON F.FIX_ID = R.POINT
  AND F.ICAO_REGION_CODE = R.ICAO_REGION_CODE
  LEFT JOIN NAV_BASE N ON N.NAV_ID = R.POINT`;

function routeSelect(type, routeTable, baseTable, codeColumn, nameColumn) {
  return `SELECT '${type}' AS type, B.${nameColumn} AS name, B.${codeColumn} AS code,
    B.SERVED_ARPT AS airportId, R.ROUTE_PORTION_TYPE AS portionType,
    CAST(A.LAT_DECIMAL AS REAL) AS airportLatitude,
    CAST(A.LONG_DECIMAL AS REAL) AS airportLongitude,
    R.ROUTE_NAME AS routeName, R.BODY_SEQ AS bodySequence,
    R.TRANSITION_COMPUTER_CODE AS transitionCode, R.ARPT_RWY_ASSOC AS runwayAssociation,
    CAST(R.POINT_SEQ AS INTEGER) AS sequence, R.POINT AS fix,
    R.POINT_TYPE AS fixType, COALESCE(CAST(F.LAT_DECIMAL AS REAL),
    CAST(N.LAT_DECIMAL AS REAL)) AS latitude,
    COALESCE(CAST(F.LONG_DECIMAL AS REAL), CAST(N.LONG_DECIMAL AS REAL)) AS longitude
    FROM ${routeTable} R JOIN ${baseTable} B ON B.EFF_DATE = R.EFF_DATE
    AND B.${codeColumn} = R.${codeColumn}
    LEFT JOIN APT_BASE A ON A.ARPT_ID = B.SERVED_ARPT ${JOIN_POINT}
    WHERE F.LAT_DECIMAL IS NOT NULL OR N.LAT_DECIMAL IS NOT NULL
    ORDER BY B.${codeColumn}, R.ROUTE_PORTION_TYPE, R.ROUTE_NAME,
    R.BODY_SEQ, R.TRANSITION_COMPUTER_CODE, R.ARPT_RWY_ASSOC, CAST(R.POINT_SEQ AS INTEGER)`;
}

export const SID_QUERY = routeSelect("SID", "DP_RTE", "DP_BASE", "DP_COMPUTER_CODE", "DP_NAME");
export const STAR_QUERY = routeSelect(
  "STAR",
  "STAR_RTE",
  "STAR_BASE",
  "STAR_COMPUTER_CODE",
  "ARRIVAL_NAME",
);
