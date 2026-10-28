import { expect, jest, test } from "@jest/globals";
import { createAirportDatabase } from "../../../src/backend/airport/database.mjs";
test("guards query access after repeatable database close", () => {
  const statement = { all: jest.fn(() => []) };
  const database = { prepare: jest.fn(() => statement), close: jest.fn() };
  const Database = jest.fn(() => database);
  const repository = createAirportDatabase("nasr.sqlite", { Database, exists: () => true });
  expect(repository.findBetween({ latitude: 43, longitude: -70 }, 0, 20)).toEqual([]);
  repository.close();
  repository.close();
  expect(database.close).toHaveBeenCalledTimes(1);
  for (const query of [
    () => repository.findBetween({}, 0, 20),
    () => repository.findNavaidsBetween({}, 0, 20),
    () => repository.findIlsApproaches({}, 0, 20),
    () => repository.findProceduresBetween({}, 0, 20),
    () => repository.findAirwaysBetween({}, 0, 20),
    () => repository.findBoundariesBetween({}, 0, 20),
  ])
    expect(query).toThrow("Airport database is closed.");
  expect(createAirportDatabase(undefined, { exists: () => false })).toBeNull();
});
