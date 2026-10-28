import { DatabaseSync } from "node:sqlite";
import { expect, test } from "@jest/globals";
import { installNasrIndexes } from "../../../../src/backend/nasr/index-installer.mjs";
import { REQUIRED_COLUMNS } from "../../../../src/backend/nasr/indexes.mjs";
import { validateNasrImportDatabase } from "../../../../src/backend/nasr/import/validation.mjs";

function createDatabase() {
  const database = new DatabaseSync(":memory:");
  for (const [table, names] of Object.entries(REQUIRED_COLUMNS)) {
    const columns = [...new Set(names.split(" "))].map((name) => `"${name}" TEXT`).join(", ");
    database.exec(`CREATE TABLE "${table}" (${columns})`);
  }
  return database;
}

test("validates schema, installed indexes, and query plans", () => {
  const database = createDatabase();
  installNasrIndexes(database);
  expect(() => validateNasrImportDatabase(database)).not.toThrow();
  database.close();
});

test("stops verification when database integrity fails", () => {
  const database = { prepare: () => ({ get: () => ({ integrity_check: "corrupt" }) }) };
  expect(() => validateNasrImportDatabase(database)).toThrow("integrity check failed");
});
