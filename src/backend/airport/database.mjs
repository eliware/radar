import { default as openAirportDatabase } from "../open-airport-database.mjs";
import { default as createAirportQueries } from "./queries.mjs";
import { default as createAirportDatabaseGuard } from "./database-guard.mjs";

function createAirportDatabase(path, options) {
  const database = openAirportDatabase(path, options);
  if (!database) return null;
  const queries = createAirportQueries(database);
  return createAirportDatabaseGuard(database, queries);
}
export default createAirportDatabase;
