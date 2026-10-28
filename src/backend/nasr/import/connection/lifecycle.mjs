export function withNasrDatabase(Database, path, operation) {
  const database = new Database(path);
  return withNasrDatabaseConnection(database, operation);
}

export function withNasrDatabaseConnection(database, operation) {
  try {
    return operation(database);
  } finally {
    database.close();
  }
}
