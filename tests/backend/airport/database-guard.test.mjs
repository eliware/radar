import { expect, jest, test } from "@jest/globals";
import { createAirportDatabaseGuard } from "../../../src/backend/airport/database-guard.mjs";

test("guards every query after closing once", () => {
  const query = jest.fn(() => []);
  const queries = Object.fromEntries(
    [
      "findBetween",
      "findNavaidsBetween",
      "findIlsApproaches",
      "findProceduresBetween",
      "findAirwaysBetween",
      "findBoundariesBetween",
    ].map((name) => [name, query]),
  );
  const database = { close: jest.fn() };
  const guarded = createAirportDatabaseGuard(database, queries);
  expect(guarded.findBetween(43, -70)).toEqual([]);
  guarded.close();
  guarded.close();
  expect(database.close).toHaveBeenCalledTimes(1);
  for (const name of Object.keys(queries))
    expect(() => guarded[name]()).toThrow("Airport database is closed.");
});
