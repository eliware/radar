import { DatabaseSync } from "node:sqlite";
import { REQUIRED_COLUMNS } from "../src/backend/nasr/required-columns.mjs";

export function createNasrTestDatabase(columnsByTable = REQUIRED_COLUMNS) {
  const database = new DatabaseSync(":memory:");
  for (const [table, names] of Object.entries(columnsByTable)) {
    const columns = [...new Set(names.split(" "))].map((name) => `"${name}" TEXT`).join(", ");
    database.exec(`CREATE TABLE "${table}" (${columns})`);
  }
  return database;
}
