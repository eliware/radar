import { expect, test } from "@jest/globals";
import { default as validateNasrImportDatabase } from "../../../../src/backend/nasr/import/validation.mjs";
import { createNasrTestDatabase } from "../../../../test-fixtures/nasr-database.mjs";

test("validates the imported database schema", () => {
  const database = createNasrTestDatabase();
  expect(() => validateNasrImportDatabase(database)).not.toThrow();
  database.close();
});

test("stops verification when database integrity fails", () => {
  const database = { prepare: () => ({ get: () => ({ integrity_check: "corrupt" }) }) };
  expect(() => validateNasrImportDatabase(database)).toThrow("integrity check failed");
});
