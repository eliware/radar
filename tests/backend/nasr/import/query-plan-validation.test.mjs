import { expect, test } from "@jest/globals";
import { validateNasrImportQueryPlans } from "../../../../src/backend/nasr/import/query-plan-validation.mjs";
import { installNasrIndexes } from "../../../../src/backend/nasr/index/installer.mjs";
import { createNasrTestDatabase } from "../../../../test-fixtures/nasr-database.mjs";

test("validates representative query plans", () => {
  const database = createNasrTestDatabase();
  installNasrIndexes(database);
  expect(() => validateNasrImportQueryPlans(database)).not.toThrow();
  database.close();
});
