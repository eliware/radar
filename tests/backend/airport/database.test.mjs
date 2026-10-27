import { expect, jest, test } from "@jest/globals";
import { createAirportDatabase } from "../../../src/backend/airport/database.mjs";

test("assembles airport and navaid reference lookups with close support", () => {
  const statement = { all: jest.fn(() => []) };
  const database = { prepare: jest.fn(() => statement), close: jest.fn() };
  const Database = jest.fn(() => database);
  const repository = createAirportDatabase("nasr.sqlite", { Database, exists: () => true });
  const location = { latitude: 43, longitude: -70 };

  expect(repository.findBetween(location, 0, 20)).toEqual([]);
  expect(repository.findNavaidsBetween(location, 0, 20)).toEqual([]);
  expect(statement.all).toHaveBeenCalledTimes(2);
  repository.close();
  repository.close();
  expect(database.close).toHaveBeenCalledTimes(1);
  for (const query of [
    () => repository.findBetween(location, 0, 20),
    () => repository.findNavaidsBetween(location, 0, 20),
    () => repository.findIlsApproaches(location, 0, 20),
    () => repository.findProceduresBetween(location, 0, 20),
    () => repository.findAirwaysBetween(location, 0, 20),
    () => repository.findBoundariesBetween(location, 0, 20),
  ])
    expect(query).toThrow("Airport database is closed.");
  expect(createAirportDatabase(undefined, { exists: () => false })).toBeNull();
});
