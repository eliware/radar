import { expect, jest, test } from "@jest/globals";
import { createAirportDatabase } from "../../../src/backend/airport/database.mjs";
import { createAirportQueries } from "../../../src/backend/airport/queries.mjs";

test("assembles all airport reference query functions", () => {
  const statements = [];
  const database = {
    prepare: jest.fn((sql) => {
      const statement = { sql, all: jest.fn(() => []) };
      statements.push(statement);
      return statement;
    }),
  };
  const queries = createAirportQueries(database);
  const location = { latitude: 43, longitude: -70 };
  expect(Object.keys(queries)).toEqual([
    "findBetween",
    "findNavaidsBetween",
    "findIlsApproaches",
    "findProceduresBetween",
    "findAirwaysBetween",
    "findBoundariesBetween",
  ]);
  expect(queries.findBetween(location, 0, 20)).toEqual([]);
  expect(queries.findNavaidsBetween(location, 0, 20)).toEqual([]);
  expect(queries.findIlsApproaches(location, 0, 20)).toEqual([]);
  expect(queries.findProceduresBetween(location, 0, 20)).toEqual([]);
  expect(queries.findAirwaysBetween(location, 0, 20)).toEqual([]);
  expect(queries.findBoundariesBetween(location, 0, 20)).toEqual([]);
  expect(statements.length).toBeGreaterThan(6);
});

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
