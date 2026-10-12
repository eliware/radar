import { expect, jest, test } from "@jest/globals";
import { registerAirspaceBoundaryRoutes } from "../../src/backend/airspace-boundary-routes.mjs";

function route(database, location = { latitude: 43, longitude: -70 }) {
  const routes = new Map();
  registerAirspaceBoundaryRoutes(
    { get: (path, handler) => routes.set(path, handler) },
    database,
    location,
  );
  return routes.get("/api/airspace-boundaries");
}

test("returns ARTCC boundaries for the requested range band", async () => {
  const boundaries = [{ locationId: "ZBW" }];
  const database = { findBoundariesBetween: jest.fn(() => boundaries) };
  const result = await route(database)({ query: { minRangeNm: "20", maxRangeNm: "30" } }, {});
  expect(database.findBoundariesBetween).toHaveBeenCalledWith(
    { latitude: 43, longitude: -70 },
    20,
    30,
  );
  expect(result).toEqual(boundaries);
});

test("rejects invalid range or missing NASR data", async () => {
  const reply = {
    code: jest.fn(function (status) {
      this.status = status;
      return this;
    }),
    send: jest.fn(),
  };
  await route(null)({ query: { maxRangeNm: "301" } }, reply);
  expect(reply.code).toHaveBeenCalledWith(503);
  await route({ findBoundariesBetween: jest.fn() })({ query: { maxRangeNm: "301" } }, reply);
  expect(reply.code).toHaveBeenLastCalledWith(400);
});

test("rejects a missing home location", async () => {
  const reply = {
    code: jest.fn(function (status) {
      this.status = status;
      return this;
    }),
    send: jest.fn(),
  };
  await route({ findBoundariesBetween: jest.fn() }, null)({ query: { maxRangeNm: "20" } }, reply);
  expect(reply.code).toHaveBeenCalledWith(503);
  expect(reply.send).toHaveBeenCalledWith({ error: "Home location is not configured." });
});
