import { AIRWAY_QUERY } from "./query-rules.mjs";
import { default as buildAirways } from "./path-builder.mjs";
import { default as pathInRange } from "./range.mjs";

function createAirwayQuery(database) {
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
export default createAirwayQuery;
