import { default as withNasrDatabaseConnection } from "./connection.mjs";

function withNasrDatabase(Database, path, operation) {
  const database = new Database(path, { readOnly: false });
  return withNasrDatabaseConnection(database, operation);
}
export default withNasrDatabase;
