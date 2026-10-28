import { expect, jest, test } from "@jest/globals";
import { createAirportQueries } from "../../../src/backend/airport/queries.mjs";

test("provides the airport query function interface", () => {
  const queries = createAirportQueries({ prepare: jest.fn(() => ({ all: () => [] })) });
  expect(Object.keys(queries)).toEqual([
    "findBetween",
    "findNavaidsBetween",
    "findIlsApproaches",
    "findProceduresBetween",
    "findAirwaysBetween",
    "findBoundariesBetween",
  ]);
  expect(Object.values(queries).every((query) => typeof query === "function")).toBe(true);
});
