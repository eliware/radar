export function withNasrDatabase(Database, path, options, operation) {
  const database = options === undefined ? new Database(path) : new Database(path, options);
  try {
    return operation(database);
  } finally {
    database.close();
  }
}
