import { expect, test } from "@jest/globals";
import { installNasrIndexes } from "../../../../src/backend/nasr/index/installer.mjs";
import { validateNasrImportDatabase } from "../../../../src/backend/nasr/import/validation.mjs";
import { createNasrTestDatabase } from "../../../../test-fixtures/nasr-database.mjs";

test("validates schema and installed indexes", () => {
  const database = createNasrTestDatabase();
  installNasrIndexes(database);
  expect(() => validateNasrImportDatabase(database)).not.toThrow();
  database.close();
});

test("stops verification when database integrity fails", () => {
  const database = { prepare: () => ({ get: () => ({ integrity_check: "corrupt" }) }) };
  expect(() => validateNasrImportDatabase(database)).toThrow("integrity check failed");
});
