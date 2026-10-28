import { expect, jest, test } from "@jest/globals";
import { registerCoreRoutes } from "../../src/backend/core-routes.mjs";

function register(feed, options) {
  const routes = new Map();
  registerCoreRoutes({ get: (path, handler) => routes.set(path, handler) }, feed, options);
  return routes;
}

test("registers health, readiness, configuration, and aircraft handlers", async () => {
  const feed = { isReady: jest.fn(() => true), list: jest.fn(() => [{ icao: "ABC123" }]) };
  const routes = register(feed, {
    location: { latitude: 43, longitude: -70 },
    elevationFeet: 300,
    defaultRangeNm: 25,
    defaultRotationDegrees: 140,
  });

  expect(await routes.get("/health")()).toEqual({ status: "ok" });
  expect(await routes.get("/ready")({}, { code: jest.fn() })).toEqual({ status: "ready" });
  expect(await routes.get("/api/config")()).toEqual({
    location: { latitude: 43, longitude: -70 },
    elevationFeet: 300,
    defaultRangeNm: 25,
    defaultRotationDegrees: 140,
  });
  expect(await routes.get("/api/aircraft")()).toEqual([{ icao: "ABC123" }]);
});

test("reports not-ready feeds and uses default configuration", async () => {
  const routes = register({ isReady: () => false, list: () => [] });
  const reply = { code: jest.fn() };

  expect(await routes.get("/ready")({}, reply)).toEqual({ status: "not_ready" });
  expect(reply.code).toHaveBeenCalledWith(503);
  expect(await routes.get("/api/config")()).toEqual({
    location: null,
    elevationFeet: 300,
    defaultRangeNm: 20,
    defaultRotationDegrees: 0,
  });
});
