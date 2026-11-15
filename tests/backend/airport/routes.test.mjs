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
