import { expect, jest, test } from "@jest/globals";
import { default as registerProcedureRoutes } from "../../../src/backend/procedure/routes.mjs";

function setup(
  database = { findProceduresBetween: jest.fn(() => [{ id: "route" }]) },
  location = { latitude: 43, longitude: -70 },
) {
  let handler;
  const app = {
    get: jest.fn((path, callback) => {
      if (path === "/api/procedures") handler = callback;
    }),
  };
  registerProcedureRoutes(app, database, location);
  return { handler, database };
}

function reply() {
  return {
    code: jest.fn(function (status) {
      this.status = status;
      return this;
    }),
    send: jest.fn((body) => body),
  };
}

test("returns routes for a valid distance band", async () => {
  const { handler, database } = setup();
  const result = await handler({ query: { minRangeNm: "10", maxRangeNm: "20" } }, reply());
  expect(result).toEqual([{ id: "route" }]);
  expect(database.findProceduresBetween).toHaveBeenCalledWith(
    { latitude: 43, longitude: -70 },
    10,
    20,
  );
});
