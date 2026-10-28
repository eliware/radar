import { expect, jest, test } from "@jest/globals";
import {
  prepareNasrTemporaryDatabase,
  validateNasrSource,
} from "../../../../src/backend/nasr/import/connection-checks.mjs";
import { NASR_INDEXES } from "../../../../src/backend/nasr/indexes.mjs";
import { createNasrTestDatabase } from "../../../../test-fixtures/nasr-database.mjs";

function retainOnClose(database) {
  return {
    exec: (...args) => database.exec(...args),
    prepare: (...args) => database.prepare(...args),
    close: jest.fn(),
  };
}

test("validates the read-only source database and closes its connection", () => {
  const database = retainOnClose(createNasrTestDatabase());
  const Database = jest.fn(() => database);
  expect(validateNasrSource(Database, "source.sqlite")).toBeUndefined();
  expect(Database).toHaveBeenCalledWith("source.sqlite", { readOnly: true });
  expect(database.close).toHaveBeenCalledTimes(1);
});

test("prepares and validates the temporary database before closing it", () => {
  const database = retainOnClose(createNasrTestDatabase());
  const Database = jest.fn(() => database);
  expect(prepareNasrTemporaryDatabase(Database, "temporary.sqlite")).toBe(NASR_INDEXES.length);
  expect(Database).toHaveBeenCalledWith("temporary.sqlite");
  expect(database.close).toHaveBeenCalledTimes(1);
});

test("closes the temporary database when index preparation fails", () => {
  const database = retainOnClose(createNasrTestDatabase({}));
  const Database = jest.fn(() => database);
  expect(() => prepareNasrTemporaryDatabase(Database, "temporary.sqlite")).toThrow();
  expect(database.close).toHaveBeenCalledTimes(1);
});
