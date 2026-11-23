import { DatabaseSync } from "node:sqlite";

function selectNasrDatabase(Database = DatabaseSync) {
  return Database;
}
export default selectNasrDatabase;
