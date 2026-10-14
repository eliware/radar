import { openAirportDatabase } from "./open-airport-database.mjs";
import { createArtccBoundaryQuery } from "./artcc-boundary-query.mjs";
import { createIlsApproachQuery } from "./ils-approach-query.mjs";
import { createProcedureQuery } from "./procedure-query.mjs";
import { createAirportReferenceQueries } from "./create-airport-reference-queries.mjs";

export function createAirportDatabase(path, options) {
  const database = openAirportDatabase(path, options);
  if (!database) return null;
  const references = createAirportReferenceQueries(database);
  const findBoundaries = createArtccBoundaryQuery(database);
  const findIlsApproaches = createIlsApproachQuery(database);
  const findProceduresBetween = createProcedureQuery(database);
  return {
    ...references,
    findIlsApproaches,
    findProceduresBetween,
    findBoundariesBetween: findBoundaries,
    close: () => database.close(),
  };
}
