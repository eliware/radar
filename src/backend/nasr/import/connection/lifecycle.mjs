import { default as withNasrDatabaseConnection } from "./connection.mjs";

function withNasrDatabase(Database, path, operation) {
  const database = new Database(path);
  return withNasrDatabaseConnection(database, operation);
}
export default withNasrDatabase;
