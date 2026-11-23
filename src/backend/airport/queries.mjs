import { default as createArtccBoundaryQuery } from "../artcc-boundary-query.mjs";
import { default as createIlsApproachQuery } from "../ils/approach/query.mjs";
import { default as createProcedureQuery } from "../procedure/query.mjs";
import { default as createAirportReferenceQuery } from "./reference-query.mjs";
import { default as createNavaidQuery } from "../navaid/query.mjs";
import { default as createAirwayQuery } from "../airway/query.mjs";

function createAirportQueries(database) {
  return {
    findBetween: createAirportReferenceQuery(database),
    findNavaidsBetween: createNavaidQuery(database),
    findIlsApproaches: createIlsApproachQuery(database),
    findProceduresBetween: createProcedureQuery(database),
    findAirwaysBetween: createAirwayQuery(database),
    findBoundariesBetween: createArtccBoundaryQuery(database),
  };
}
export default createAirportQueries;
