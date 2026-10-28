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

test("rejects an invalid range and reports unavailable data", async () => {
  const invalidReply = reply();
  await route({ findBetween: jest.fn() })({ query: { maxRangeNm: "301" } }, invalidReply);
  expect(invalidReply.code).toHaveBeenCalledWith(400);
  const missingReply = reply();
  await route(null)({ query: { maxRangeNm: "20" } }, missingReply);
  expect(missingReply.code).toHaveBeenCalledWith(503);
});

test("requires a home location", async () => {
  const response = reply();
  await route({ findBetween: jest.fn() }, null)({ query: { maxRangeNm: "20" } }, response);
  expect(response.code).toHaveBeenCalledWith(503);
});
