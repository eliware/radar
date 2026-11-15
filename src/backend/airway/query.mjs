import { AIRWAY_QUERY } from "./query-rules.mjs";
import { buildAirways } from "./path-builder.mjs";
import { pathInRange } from "./range.mjs";

export function createAirwayQuery(database) {
  const statement = database.prepare(AIRWAY_QUERY);
  let rows;
  let paths;
  let pathLocation;
  return (location, minRangeNm, maxRangeNm) => {
    rows ??= statement.all();
    if (
      !paths ||
      pathLocation?.latitude !== location.latitude ||
      pathLocation?.longitude !== location.longitude
    ) {
      paths = buildAirways(rows, location);
      pathLocation = { latitude: location.latitude, longitude: location.longitude };
    }
    return paths.filter((path) => pathInRange(path.points, minRangeNm, maxRangeNm));
  };
}
