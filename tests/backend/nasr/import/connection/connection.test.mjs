import { expect, jest, test } from "@jest/globals";
import { withNasrDatabaseConnection } from "../../../../../src/backend/nasr/import/connection/connection.mjs";

test("closes the database when the operation completes", () => {
  const database = { close: jest.fn() };
  expect(withNasrDatabaseConnection(database, (value) => value)).toBe(database);
  expect(database.close).toHaveBeenCalledTimes(1);
});

test("closes the database when the operation throws", () => {
  const database = { close: jest.fn() };
  expect(() =>
    withNasrDatabaseConnection(database, () => {
      throw new Error("failed");
    }),
  ).toThrow("failed");
  expect(database.close).toHaveBeenCalledTimes(1);
});
