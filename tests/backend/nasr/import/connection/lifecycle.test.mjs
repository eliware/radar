import { expect, jest, test } from "@jest/globals";
import { withNasrDatabase } from "../../../../../src/backend/nasr/import/connection/lifecycle.mjs";

test("opens source databases with the requested connection options", () => {
  const database = { close: jest.fn() };
  const Database = jest.fn(() => database);
  const result = withNasrDatabase(Database, "source.sqlite", { readOnly: true }, () => "checked");
  expect(Database).toHaveBeenCalledWith("source.sqlite", { readOnly: true });
  expect(result).toBe("checked");
  expect(database.close).toHaveBeenCalledTimes(1);
});

test("opens temporary databases with defaults and closes after operation errors", () => {
  const database = { close: jest.fn() };
  const Database = jest.fn(() => database);
  expect(() =>
    withNasrDatabase(Database, "temporary.sqlite", undefined, () => {
      throw new Error("validation failed");
    }),
  ).toThrow("validation failed");
  expect(Database).toHaveBeenCalledWith("temporary.sqlite");
  expect(database.close).toHaveBeenCalledTimes(1);
});
