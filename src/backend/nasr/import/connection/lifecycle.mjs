import { withNasrDatabaseConnection } from "./connection.mjs";

export function withNasrDatabase(Database, path, operation) {
  const database = new Database(path);
  return withNasrDatabaseConnection(database, operation);
}
