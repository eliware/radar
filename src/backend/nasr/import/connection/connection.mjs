export function withNasrDatabaseConnection(database, operation) {
  try {
    return operation(database);
  } finally {
    database.close();
  }
}
