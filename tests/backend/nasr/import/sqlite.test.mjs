import { DatabaseSync } from "node:sqlite";
import { expect, jest, test } from "@jest/globals";
import { selectNasrDatabase } from "../../../../src/backend/nasr/import/sqlite.mjs";

test("selects the built-in SQLite connection by default", () => {
  expect(selectNasrDatabase()).toBe(DatabaseSync);
});

test("preserves an injected SQLite connection constructor", () => {
  const Database = jest.fn();
  expect(selectNasrDatabase(Database)).toBe(Database);
});
