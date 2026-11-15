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

test("registers the airspace boundary endpoint", () => {
  expect(route({ findBoundariesBetween: jest.fn() })).toBeInstanceOf(Function);
});
