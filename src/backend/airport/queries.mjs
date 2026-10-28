import { createArtccBoundaryQuery } from "../artcc-boundary-query.mjs";
import { createIlsApproachQuery } from "../ils/approach/query.mjs";
import { createProcedureQuery } from "../procedure/query.mjs";
import { createAirportReferenceQueries } from "../create-airport-reference-queries.mjs";
import { createAirwayQuery } from "../airway/query.mjs";

export function createAirportQueries(database) {
  const references = createAirportReferenceQueries(database);
  return {
    findBetween: references.findBetween,
    findNavaidsBetween: references.findNavaidsBetween,
    findIlsApproaches: createIlsApproachQuery(database),
    findProceduresBetween: createProcedureQuery(database),
    findAirwaysBetween: createAirwayQuery(database),
    findBoundariesBetween: createArtccBoundaryQuery(database),
  };
}
