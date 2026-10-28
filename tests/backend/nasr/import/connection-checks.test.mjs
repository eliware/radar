import { DatabaseSync } from "node:sqlite";
import { expect, jest, test } from "@jest/globals";
import {
  prepareNasrTemporaryDatabase,
  validateNasrSource,
} from "../../../../src/backend/nasr/import/connection-checks.mjs";
import { NASR_INDEXES, REQUIRED_COLUMNS } from "../../../../src/backend/nasr/indexes.mjs";

function createDatabase(columnsByTable = REQUIRED_COLUMNS) {
  const database = new DatabaseSync(":memory:");
  for (const [table, names] of Object.entries(columnsByTable)) {
    const columns = [...new Set(names.split(" "))].map((name) => `"${name}" TEXT`).join(", ");
    database.exec(`CREATE TABLE "${table}" (${columns})`);
  }
  return database;
}

function retainOnClose(database) {
  return {
    exec: (...args) => database.exec(...args),
    prepare: (...args) => database.prepare(...args),
    close: jest.fn(),
  };
}

test("validates the read-only source database and closes its connection", () => {
  const database = retainOnClose(createDatabase());
  const Database = jest.fn(() => database);
  expect(validateNasrSource(Database, "source.sqlite")).toBeUndefined();
  expect(Database).toHaveBeenCalledWith("source.sqlite", { readOnly: true });
  expect(database.close).toHaveBeenCalledTimes(1);
});

test("prepares and validates the temporary database before closing it", () => {
  const database = retainOnClose(createDatabase());
  const Database = jest.fn(() => database);
  expect(prepareNasrTemporaryDatabase(Database, "temporary.sqlite")).toBe(NASR_INDEXES.length);
  expect(Database).toHaveBeenCalledWith("temporary.sqlite");
  expect(database.close).toHaveBeenCalledTimes(1);
});

test("closes the temporary database when index preparation fails", () => {
  const database = retainOnClose(createDatabase({}));
  const Database = jest.fn(() => database);
  expect(() => prepareNasrTemporaryDatabase(Database, "temporary.sqlite")).toThrow();
  expect(database.close).toHaveBeenCalledTimes(1);
});
