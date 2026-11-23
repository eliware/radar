import { expect, jest, test } from "@jest/globals";
import { default as withNasrDatabase } from "../../../../../src/backend/nasr/import/connection/lifecycle.mjs";

test("opens temporary databases with defaults and closes after operation errors", () => {
  const database = { close: jest.fn() };
  const Database = jest.fn(() => database);
  expect(() =>
    withNasrDatabase(Database, "temporary.sqlite", () => {
      throw new Error("validation failed");
    }),
  ).toThrow("validation failed");
  expect(Database).toHaveBeenCalledWith("temporary.sqlite", { readOnly: false });
  expect(database.close).toHaveBeenCalledTimes(1);
});
