import { expect, jest, test } from "@jest/globals";
import { default as registerAirwayRoutes } from "../../../src/backend/airway/routes.mjs";

function setup(database, location) {
  const routes = new Map();
  registerAirwayRoutes({ get: (path, handler) => routes.set(path, handler) }, database, location);
  return routes.get("/api/airways");
}

function reply() {
  const value = { code: jest.fn(), send: jest.fn() };
  value.code.mockReturnValue(value);
  value.send.mockReturnValue(value);
  return value;
}

test("forwards its range band to the airway query", async () => {
  const result = [{ identifier: "V12" }];
  const database = { findAirwaysBetween: jest.fn(() => result) };
  expect(
    await setup(database, { latitude: 43, longitude: -70 })(
      { query: { minRangeNm: "10", maxRangeNm: "20" } },
      reply(),
    ),
  ).toEqual(result);
  expect(database.findAirwaysBetween).toHaveBeenCalledWith(
    { latitude: 43, longitude: -70 },
    10,
    20,
  );
});
