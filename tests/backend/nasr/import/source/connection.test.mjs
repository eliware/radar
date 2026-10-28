import { expect, jest, test } from "@jest/globals";
import { withNasrSourceDatabase } from "../../../../../src/backend/nasr/import/source/connection.mjs";
import { createNasrTestDatabase } from "../../../../../test-fixtures/nasr-database.mjs";

function retainOnClose(database) {
  return {
    exec: (...args) => database.exec(...args),
    prepare: (...args) => database.prepare(...args),
    close: jest.fn(),
  };
}

test("opens a read-only source connection and closes it after the operation", () => {
  const database = retainOnClose(createNasrTestDatabase());
  const Database = jest.fn(() => database);
  const operation = jest.fn(() => "source checked");
  expect(withNasrSourceDatabase(Database, "source.sqlite", operation)).toBe("source checked");
  expect(Database).toHaveBeenCalledWith("source.sqlite", { readOnly: true });
  expect(operation).toHaveBeenCalledWith(database);
  expect(database.close).toHaveBeenCalledTimes(1);
});
