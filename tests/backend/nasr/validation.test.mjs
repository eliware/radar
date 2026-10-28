import { DatabaseSync } from "node:sqlite";
import { expect, test } from "@jest/globals";
import { REQUIRED_COLUMNS } from "../../../src/backend/nasr/required-columns.mjs";
import { validateNasrDatabase } from "../../../src/backend/nasr/validation.mjs";

function createDatabase(columnsByTable = REQUIRED_COLUMNS) {
  const database = new DatabaseSync(":memory:");
  for (const [table, names] of Object.entries(columnsByTable)) {
    const columns = [...new Set(names.split(" "))].map((name) => `"${name}" TEXT`).join(", ");
    database.exec(`CREATE TABLE "${table}" (${columns})`);
  }
  return database;
}

test("validates integrity and required columns", () => {
  const database = createDatabase();
  expect(() => validateNasrDatabase(database)).not.toThrow();
  database.close();
});

test("rejects corrupt integrity and missing NASR columns", () => {
  const corrupt = { prepare: () => ({ get: () => ({ integrity_check: "corrupt" }) }) };
  expect(() => validateNasrDatabase(corrupt)).toThrow("integrity check failed");
  expect(() => validateNasrDatabase(createDatabase({ OTHER: "VALUE" }))).toThrow(
    "Invalid NASR database: APT_BASE",
  );
});
