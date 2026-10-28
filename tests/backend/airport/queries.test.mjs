import { expect, jest, test } from "@jest/globals";
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
