import { DatabaseSync } from "node:sqlite";
import { expect, test } from "@jest/globals";
import { NASR_INDEXES, REQUIRED_COLUMNS } from "../../../src/backend/nasr/indexes.mjs";
import { validateNasrDatabase, verifyNasrIndexes } from "../../../src/backend/nasr/validation.mjs";

function createDatabase(columnsByTable = REQUIRED_COLUMNS) {
  const database = new DatabaseSync(":memory:");
  for (const [table, names] of Object.entries(columnsByTable)) {
    const columns = [...new Set(names.split(" "))].map((name) => `"${name}" TEXT`).join(", ");
    database.exec(`CREATE TABLE "${table}" (${columns})`);
  }
  return database;
}

test("validates integrity, required columns, and index definitions", () => {
  const database = createDatabase();
  expect(() => validateNasrDatabase(database)).not.toThrow();
  expect(() => verifyNasrIndexes(database)).toThrow("radar_apt_location");
  for (const index of NASR_INDEXES) database.exec(index);
  expect(() => verifyNasrIndexes(database)).not.toThrow();
  database.close();
});

test("rejects corrupt integrity and missing NASR columns", () => {
  const corrupt = { prepare: () => ({ get: () => ({ integrity_check: "corrupt" }) }) };
  expect(() => validateNasrDatabase(corrupt)).toThrow("integrity check failed");
  expect(() => validateNasrDatabase(createDatabase({ OTHER: "VALUE" }))).toThrow(
    "Invalid NASR database: APT_BASE",
  );
});
