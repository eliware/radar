import { DatabaseSync } from "node:sqlite";

export function selectNasrDatabase(Database = DatabaseSync) {
  return Database;
}
