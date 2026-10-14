import { expect, jest, test } from "@jest/globals";
import { registerApiRoutes } from "../../src/backend/api-routes.mjs";

test("registers health, data, procedure, and update relay routes", async () => {
  const routes = new Map();
  const app = { get: jest.fn((path, ...args) => routes.set(path, args)) };
  const subscriber = jest.fn();
  const feed = { list: jest.fn(() => [{ icao: "ABC123" }]), subscribe: jest.fn(() => subscriber) };
  registerApiRoutes(app, feed, {
    location: { latitude: 43, longitude: -70 },
    elevationFeet: 300,
  });

  expect(await routes.get("/health")[0]()).toEqual({ status: "ok" });
  expect(await routes.get("/api/config")[0]()).toEqual({
    location: { latitude: 43, longitude: -70 },
    elevationFeet: 300,
  });
  expect(await routes.get("/api/aircraft")[0]()).toEqual([{ icao: "ABC123" }]);
  expect(routes.has("/api/ils")).toBe(true);
  expect(routes.has("/api/procedures")).toBe(true);
  const socket = { readyState: 1, send: jest.fn(), on: jest.fn() };
  routes.get("/ws")[1](socket);
  const update = feed.subscribe.mock.calls[0][0];
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

test("uses the default home elevation without config", async () => {
  const routes = new Map();
  registerApiRoutes({ get: (path, ...args) => routes.set(path, args) }, { list: () => [] });
  expect(await routes.get("/api/config")[0]()).toEqual({ location: null, elevationFeet: 300 });
});

test("registers the METAR route when its lookup is configured", () => {
  const routes = new Map();
  const metarLookup = { stations: ["KPWM"], get: jest.fn() };
  registerApiRoutes(
    { get: (path, ...args) => routes.set(path, args) },
    { list: () => [] },
    { metarLookup },
  );
  expect(routes.has("/api/metar")).toBe(true);
  expect(metarLookup.get).not.toHaveBeenCalled();
});
