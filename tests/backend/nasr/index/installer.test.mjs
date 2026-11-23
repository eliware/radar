import { expect, jest, test } from "@jest/globals";
import { default as installNasrIndexes } from "../../../../src/backend/nasr/index/installer.mjs";
import { NASR_INDEXES } from "../../../../src/backend/nasr/index/definitions.mjs";
import { default as verifyNasrIndexes } from "../../../../src/backend/nasr/index/validation.mjs";
import { createNasrTestDatabase } from "../../../../test-fixtures/nasr-database.mjs";

test("installs declared indexes in a transaction and analyzes the database", () => {
  const database = { exec: jest.fn() };
  expect(installNasrIndexes(database)).toBe(NASR_INDEXES.length);
  expect(database.exec.mock.calls).toEqual(
    ["BEGIN", ...NASR_INDEXES, "COMMIT", "ANALYZE"].map((sql) => [sql]),
  );
});

test("installs indexes that pass verification", () => {
  const database = createNasrTestDatabase();
  installNasrIndexes(database);
  expect(() => verifyNasrIndexes(database)).not.toThrow();
  database.close();
});
