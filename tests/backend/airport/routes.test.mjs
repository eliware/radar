import { expect, jest, test } from "@jest/globals";
import { registerAirportRoutes } from "../../../src/backend/airport/routes.mjs";

function route(database, location = { latitude: 43, longitude: -70 }) {
  const routes = new Map();
  registerAirportRoutes({ get: (path, handler) => routes.set(path, handler) }, database, location);
  return routes.get("/api/airports");
}

function reply() {
  return {
    code: jest.fn(function (status) {
      this.status = status;
      return this;
    }),
    send: jest.fn(),
  };
}

test("forwards a valid range to the airport query", async () => {
  const airports = [{ icao: "KPWM" }];
  const database = { findBetween: jest.fn(() => airports) };
  expect(await route(database)({ query: { minRangeNm: "10", maxRangeNm: "20" } }, reply())).toEqual(
    airports,
  );
  expect(database.findBetween).toHaveBeenCalledWith({ latitude: 43, longitude: -70 }, 10, 20);
});

test("reports unavailable data or home configuration", async () => {
  function reply() {
    return {
      code: jest.fn(function (status) {
        this.status = status;
        return this;
      }),
      send: jest.fn(function (body) {
        this.body = body;
        return this;
      }),
    };
  }

  const unavailable = reply();
  await route(null)({ query: { maxRangeNm: "20" } }, unavailable);
  expect(unavailable.status).toBe(503);
  expect(unavailable.send).toHaveBeenCalledWith({ error: "NASR database is not available." });

  const noHome = reply();
  await route({ findBetween: jest.fn() }, null)({ query: { maxRangeNm: "20" } }, noHome);
  expect(noHome.status).toBe(503);
  expect(noHome.send).toHaveBeenCalledWith({ error: "Home location is not configured." });
});
