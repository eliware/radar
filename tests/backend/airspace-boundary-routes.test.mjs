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

test("reports missing NASR data", async () => {
  const reply = {
    code: jest.fn(function (status) {
      this.status = status;
      return this;
    }),
    send: jest.fn(),
  };
  await route(null)({ query: { maxRangeNm: "20" } }, reply);
  expect(reply.code).toHaveBeenCalledWith(503);
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
