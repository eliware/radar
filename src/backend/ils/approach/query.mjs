import { createIlsMarkerIndex } from "../marker-groups.mjs";
import { mapIlsApproachRows } from "./mapper.mjs";
import { ILS_APPROACH_QUERY, ILS_MARKER_QUERY } from "./sql.mjs";

export { ILS_APPROACH_QUERY, ILS_MARKER_QUERY };

export function createIlsApproachQuery(database) {
  const statement = database.prepare(ILS_APPROACH_QUERY);
  const markerStatement = database.prepare(ILS_MARKER_QUERY);
  return (location, minRangeNm, maxRangeNm) => {
    const bounds = selectBounds(location, maxRangeNm);
    const markersBySystem = createIlsMarkerIndex(markerStatement.all(...bounds), location);
    return mapIlsApproachRows(
      statement.all(...bounds),
      location,
      minRangeNm,
      maxRangeNm,
      markersBySystem,
    );
  };
}

function selectBounds(location, maxRangeNm) {
  const latDelta = maxRangeNm / 60;
  const lonDelta =
    maxRangeNm / (60 * Math.max(0.01, Math.cos((location.latitude * Math.PI) / 180)));
  return [
    Math.max(-90, location.latitude - latDelta),
    Math.min(90, location.latitude + latDelta),
    Math.max(-180, location.longitude - lonDelta),
    Math.min(180, location.longitude + lonDelta),
  ];
}
