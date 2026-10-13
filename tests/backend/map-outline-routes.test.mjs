import { expect, jest, test } from "@jest/globals";
import { registerMapOutlineRoutes } from "../../src/backend/map-outline-routes.mjs";

test("returns the bundled outline data from the map route", async () => {
  const routes = new Map();
  const outlines = { coastline: [], lakes: [] };
  registerMapOutlineRoutes({ get: (path, handler) => routes.set(path, handler) }, outlines);
  expect(routes.get("/api/map-outlines")).toEqual(expect.any(Function));
  await expect(routes.get("/api/map-outlines")()).resolves.toBe(outlines);
});

test("does not transform the bundled data", () => {
  const app = { get: jest.fn() };
  registerMapOutlineRoutes(app, null);
  expect(app.get).toHaveBeenCalledWith("/api/map-outlines", expect.any(Function));
});
