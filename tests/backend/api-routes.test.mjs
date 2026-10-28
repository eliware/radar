import { expect, jest, test } from "@jest/globals";
import { registerApiRoutes } from "../../src/backend/api-routes.mjs";

test("registers health, data, procedure, airway, and update relay routes", async () => {
  const routes = new Map();
  const app = {
    get: jest.fn((path, ...args) => routes.set(path, args)),
    post: jest.fn((path, ...args) => routes.set(path, args)),
  };
  const feed = {
    list: jest.fn(() => [{ icao: "ABC123" }]),
    isReady: jest.fn(() => true),
  };
  registerApiRoutes(app, feed, {
    location: { latitude: 43, longitude: -70 },
    elevationFeet: 300,
    defaultRangeNm: 25,
    defaultRotationDegrees: 140,
  });

  expect(await routes.get("/health")[0]()).toEqual({ status: "ok" });
  expect(await routes.get("/ready")[0]({}, { code: jest.fn() })).toEqual({ status: "ready" });
  expect(await routes.get("/api/config")[0]()).toEqual({
    location: { latitude: 43, longitude: -70 },
    elevationFeet: 300,
    defaultRangeNm: 25,
    defaultRotationDegrees: 140,
  });
  expect(await routes.get("/api/aircraft")[0]()).toEqual([{ icao: "ABC123" }]);
  expect(routes.has("/api/ils")).toBe(true);
  expect(routes.has("/api/procedures")).toBe(true);
  expect(routes.has("/api/airways")).toBe(true);
  expect(routes.has("/api/route-lookups")).toBe(true);
  expect(routes.has("/ws")).toBe(true);
});

test("returns service unavailable until the SBS feed connects", async () => {
  const routes = new Map();
  const feed = { isReady: jest.fn(() => false) };
  registerApiRoutes(
    {
      get: (path, ...args) => routes.set(path, args),
      post: (path, ...args) => routes.set(path, args),
    },
    feed,
  );
  const reply = { code: jest.fn() };

  expect(await routes.get("/ready")[0]({}, reply)).toEqual({ status: "not_ready" });
  expect(reply.code).toHaveBeenCalledWith(503);
});

test("uses the default home elevation without config", async () => {
  const routes = new Map();
  registerApiRoutes(
    {
      get: (path, ...args) => routes.set(path, args),
      post: (path, ...args) => routes.set(path, args),
    },
    { list: () => [] },
  );
  expect(await routes.get("/api/config")[0]()).toEqual({
    location: null,
    elevationFeet: 300,
    defaultRangeNm: 20,
    defaultRotationDegrees: 0,
  });
});

test("registers the METAR route when its lookup is configured", () => {
  const routes = new Map();
  const metarLookup = { stations: ["KPWM"], get: jest.fn() };
  registerApiRoutes(
    {
      get: (path, ...args) => routes.set(path, args),
      post: (path, ...args) => routes.set(path, args),
    },
    { list: () => [] },
    { metarLookup },
  );
  expect(routes.has("/api/metar")).toBe(true);
  expect(metarLookup.get).not.toHaveBeenCalled();
});

test("forwards range bands to airport and airspace queries through registered API routes", async () => {
  const routes = new Map();
  const airports = [{ icao: "KPWM" }];
  const boundaries = [{ locationId: "ZBW" }];
  const airportDatabase = {
    findBetween: jest.fn(() => airports),
    findBoundariesBetween: jest.fn(() => boundaries),
  };
  registerApiRoutes(
    {
      get: (path, handler) => routes.set(path, handler),
      post: (path, handler) => routes.set(path, handler),
    },
    { list: () => [] },
    { location: { latitude: 43, longitude: -70 }, airportDatabase },
  );

  expect(
    await routes.get("/api/airports")({ query: { minRangeNm: "20", maxRangeNm: "30" } }, {}),
  ).toEqual(airports);
  expect(
    await routes.get("/api/airspace-boundaries")(
      { query: { minRangeNm: "20", maxRangeNm: "30" } },
      {},
    ),
  ).toEqual(boundaries);
  expect(airportDatabase.findBetween).toHaveBeenCalledWith(
    { latitude: 43, longitude: -70 },
    20,
    30,
  );
  expect(airportDatabase.findBoundariesBetween).toHaveBeenCalledWith(
    { latitude: 43, longitude: -70 },
    20,
    30,
  );
});
