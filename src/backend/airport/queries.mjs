import { createArtccBoundaryQuery } from "../artcc-boundary-query.mjs";
import { createIlsApproachQuery } from "../ils/approach/query.mjs";
import { createProcedureQuery } from "../procedure/query.mjs";
import { createAirportReferenceQuery } from "./reference-query.mjs";
import { createNavaidQuery } from "../navaid/query.mjs";
import { createAirwayQuery } from "../airway/query.mjs";

export function createAirportQueries(database) {
  return {
    findBetween: createAirportReferenceQuery(database),
    findNavaidsBetween: createNavaidQuery(database),
    findIlsApproaches: createIlsApproachQuery(database),
    findProceduresBetween: createProcedureQuery(database),
    findAirwaysBetween: createAirwayQuery(database),
    findBoundariesBetween: createArtccBoundaryQuery(database),
  };
}
