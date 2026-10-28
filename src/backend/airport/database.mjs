import { openAirportDatabase } from "../open-airport-database.mjs";
import { createAirportQueries } from "./queries.mjs";

export function createAirportDatabase(path, options) {
  const database = openAirportDatabase(path, options);
  if (!database) return null;
  const queries = createAirportQueries(database);
  let closed = false;
  const guard =
    (query) =>
    (...args) => {
      if (closed) throw new Error("Airport database is closed.");
      return query(...args);
    };
  return {
    findBetween: guard(queries.findBetween),
    findNavaidsBetween: guard(queries.findNavaidsBetween),
    findIlsApproaches: guard(queries.findIlsApproaches),
    findProceduresBetween: guard(queries.findProceduresBetween),
    findAirwaysBetween: guard(queries.findAirwaysBetween),
    findBoundariesBetween: guard(queries.findBoundariesBetween),
    close() {
      if (closed) return;
      closed = true;
      database.close();
    },
  };
}
