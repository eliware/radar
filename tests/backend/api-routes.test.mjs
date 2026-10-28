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

test("forwards range bands and rejects invalid ranges through registered routes", async () => {
  const routes = new Map();
  const queries = {
    findBetween: jest.fn(() => [{ icao: "KPWM" }]),
    findNavaidsBetween: jest.fn(() => [{ identifier: "ENE" }]),
    findIlsApproaches: jest.fn(() => [{ runway: "18" }]),
    findProceduresBetween: jest.fn(() => [{ identifier: "SID" }]),
    findAirwaysBetween: jest.fn(() => [{ identifier: "V12" }]),
    findBoundariesBetween: jest.fn(() => [{ locationId: "ZBW" }]),
  };
  const location = { latitude: 43, longitude: -70 };
  const airportDatabase = {
    ...queries,
  };
  registerApiRoutes(
    {
      get: (path, handler) => routes.set(path, handler),
      post: (path, handler) => routes.set(path, handler),
    },
    { list: () => [] },
    { location, airportDatabase },
  );

  const endpoints = [
    ["/api/navaids", "findNavaidsBetween", [{ identifier: "ENE" }]],
    ["/api/ils", "findIlsApproaches", [{ runway: "18" }]],
    ["/api/procedures", "findProceduresBetween", [{ identifier: "SID" }]],
    ["/api/airways", "findAirwaysBetween", [{ identifier: "V12" }]],
    ["/api/airspace-boundaries", "findBoundariesBetween", [{ locationId: "ZBW" }]],
  ];
  for (const [path, queryName, result] of endpoints) {
    await expect(
      routes.get(path)({ query: { minRangeNm: "20", maxRangeNm: "30" } }, {}),
    ).resolves.toEqual(result);
    expect(queries[queryName]).toHaveBeenCalledWith(location, 20, 30);
  }

  const invalidRanges = [
    {},
    { maxRangeNm: "bad" },
    { minRangeNm: "20", maxRangeNm: "20" },
    { minRangeNm: "-1", maxRangeNm: "30" },
    { minRangeNm: "20", maxRangeNm: "10" },
    { maxRangeNm: "301" },
  ];
  for (const path of ["/api/airports", ...endpoints.map(([routePath]) => routePath)]) {
    for (const query of invalidRanges) {
      const reply = {
        code: jest.fn(function (status) {
          this.status = status;
          return this;
        }),
        send: jest.fn(function (body) {
          this.body = body;
          return this;
        }),
      };
      await routes.get(path)({ query }, reply);
      expect(reply.status).toBe(400);
      expect(reply.body).toEqual({
        error: "Use a valid range from 0 to 300 nautical miles.",
      });
    }
  }
});
