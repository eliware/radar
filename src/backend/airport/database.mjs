import { openAirportDatabase } from "../open-airport-database.mjs";
import { createArtccBoundaryQuery } from "../artcc-boundary-query.mjs";
import { createIlsApproachQuery } from "../ils/approach/query.mjs";
import { createProcedureQuery } from "../procedure/query.mjs";
import { createAirportReferenceQueries } from "../create-airport-reference-queries.mjs";
import { createAirwayQuery } from "../airway/query.mjs";

export function createAirportDatabase(path, options) {
  const database = openAirportDatabase(path, options);
  if (!database) return null;
  const references = createAirportReferenceQueries(database);
  const findBoundaries = createArtccBoundaryQuery(database);
  const findIlsApproaches = createIlsApproachQuery(database);
  const findProceduresBetween = createProcedureQuery(database);
  const findAirwaysBetween = createAirwayQuery(database);
  let closed = false;
  const guard =
    (query) =>
    (...args) => {
      if (closed) throw new Error("Airport database is closed.");
      return query(...args);
    };
  return {
    findBetween: guard(references.findBetween),
    findNavaidsBetween: guard(references.findNavaidsBetween),
    findIlsApproaches: guard(findIlsApproaches),
    findProceduresBetween: guard(findProceduresBetween),
    findAirwaysBetween: guard(findAirwaysBetween),
    findBoundariesBetween: guard(findBoundaries),
    close() {
      if (closed) return;
      closed = true;
      database.close();
    },
  };
}
