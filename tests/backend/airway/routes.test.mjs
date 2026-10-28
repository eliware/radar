import { expect, jest, test } from "@jest/globals";
import { registerAirwayRoutes } from "../../../src/backend/airway/routes.mjs";

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

test("reports unavailable database and missing home errors", async () => {
  const unavailable = reply();
  await setup(null, { latitude: 0, longitude: 0 })({ query: {} }, unavailable);
  expect(unavailable.code).toHaveBeenCalledWith(503);
  expect(unavailable.send).toHaveBeenCalledWith({ error: "NASR database is not available." });
  const missingHome = reply();
  await setup({}, null)({ query: {} }, missingHome);
  expect(missingHome.code).toHaveBeenCalledWith(503);
  expect(missingHome.send).toHaveBeenCalledWith({ error: "Home location is not configured." });
});

test("reports the route-specific invalid range message", async () => {
  const findAirwaysBetween = jest.fn(() => [{ id: "V12:0" }]);
  const handler = setup({ findAirwaysBetween }, { latitude: 43, longitude: -70 });
  const invalid = reply();
  await handler({ query: { minRangeNm: "20", maxRangeNm: "10" } }, invalid);
  expect(invalid.code).toHaveBeenCalledWith(400);
  expect(invalid.send).toHaveBeenCalledWith({
    error: "Use a valid range from 0 to 300 nautical miles.",
  });
  expect(findAirwaysBetween).not.toHaveBeenCalled();
});
