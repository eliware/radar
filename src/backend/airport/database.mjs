import { openAirportDatabase } from "../open-airport-database.mjs";
import { createAirportQueries } from "./queries.mjs";
import { createAirportDatabaseGuard } from "./database-guard.mjs";

export function createAirportDatabase(path, options) {
  const database = openAirportDatabase(path, options);
  if (!database) return null;
  const queries = createAirportQueries(database);
  return createAirportDatabaseGuard(database, queries);
}
