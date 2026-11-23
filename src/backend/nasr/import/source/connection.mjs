import { default as withNasrDatabaseConnection } from "../connection/connection.mjs";

function withNasrSourceDatabase(Database, inputPath, operation) {
  const database = new Database(inputPath, { readOnly: true });
  return withNasrDatabaseConnection(database, operation);
}
export default withNasrSourceDatabase;
