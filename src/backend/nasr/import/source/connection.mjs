import { withNasrDatabaseConnection } from "../connection/lifecycle.mjs";

export function withNasrSourceDatabase(Database, inputPath, operation) {
  const database = new Database(inputPath, { readOnly: true });
  return withNasrDatabaseConnection(database, operation);
}
