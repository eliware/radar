import { expect, jest, test } from "@jest/globals";
import { validateNasrSource } from "../../../../../src/backend/nasr/import/source/validation.mjs";
import { createNasrTestDatabase } from "../../../../../test-fixtures/nasr-database.mjs";

function retainOnClose(database) {
  return {
    exec: (...args) => database.exec(...args),
    prepare: (...args) => database.prepare(...args),
    close: jest.fn(),
  };
}

test("validates the schema through a read-only source connection", () => {
  const database = retainOnClose(createNasrTestDatabase());
  const Database = jest.fn(() => database);
  expect(validateNasrSource(Database, "source.sqlite")).toBeUndefined();
  expect(Database).toHaveBeenCalledWith("source.sqlite", { readOnly: true });
  expect(database.close).toHaveBeenCalledTimes(1);
});
