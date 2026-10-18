import { expect, jest, test } from "@jest/globals";
import { registerApiRoutes } from "../../src/backend/api-routes.mjs";

test("registers health, data, procedure, airway, and update relay routes", async () => {
  const routes = new Map();
  const app = {
    get: jest.fn((path, ...args) => routes.set(path, args)),
    post: jest.fn((path, ...args) => routes.set(path, args)),
  };
  const subscriber = jest.fn();
  const feed = {
    list: jest.fn(() => [{ icao: "ABC123" }]),
    subscribe: jest.fn(() => subscriber),
    setClientRadius: jest.fn(),
    isReady: jest.fn(() => true),
    setRouteLookupsEnabled: jest.fn(),
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
  expect(await routes.get("/api/route-lookups")[0]({ body: { enabled: false } }, {})).toEqual({
    enabled: false,
  });
  expect(feed.setRouteLookupsEnabled).toHaveBeenCalledWith(false);
  const socket = { readyState: 1, send: jest.fn(), on: jest.fn() };
  routes.get("/ws")[1](socket);
  const update = feed.subscribe.mock.calls[0][0];
  expect(feed.subscribe).toHaveBeenCalledWith(expect.any(Function), socket);
  const message = socket.on.mock.calls.find(([event]) => event === "message")[1];
  message(Buffer.from('{"type":"viewport","radiusNm":65}'));
  expect(feed.setClientRadius).toHaveBeenCalledWith(socket, 65);
  message(Buffer.from('{"type":"other"}'));
  message(Buffer.from("invalid json"));
  update({ icao: "ABC123" });
  expect(socket.send).toHaveBeenCalledWith('{"icao":"ABC123"}');
  socket.readyState = 3;
  update({ icao: "ABC123" });
  expect(socket.send).toHaveBeenCalledTimes(1);
  expect(socket.on).toHaveBeenCalledWith("close", subscriber);
  expect(socket.on).toHaveBeenCalledWith("error", subscriber);
  socket.on.mock.calls.find(([event]) => event === "close")[1]();
  expect(subscriber).toHaveBeenCalledTimes(1);
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

test("validates route lookup control requests and unavailable controls", async () => {
  const routes = new Map();
  const app = {
    get: (path, ...args) => routes.set(path, args),
    post: (path, ...args) => routes.set(path, args),
  };
  const feed = { list: () => [], setRouteLookupsEnabled: jest.fn() };
  registerApiRoutes(app, feed);
  const handler = routes.get("/api/route-lookups")[0];
  const reply = { code: jest.fn(), send: jest.fn() };
  reply.code.mockReturnValue(reply);
  await handler({ body: { enabled: "false" } }, reply);
  expect(reply.code).toHaveBeenCalledWith(400);
  expect(reply.send).toHaveBeenCalledWith({ error: "enabled must be a boolean." });
  registerApiRoutes(app, { list: () => [] });
  await routes.get("/api/route-lookups")[0]({ body: { enabled: true } }, reply);
  expect(reply.code).toHaveBeenLastCalledWith(501);
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
