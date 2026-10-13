import { expect, jest, test } from "@jest/globals";
import { registerIlsApproachRoutes } from "../../src/backend/ils-approach-routes.mjs";

function route(database, location = { latitude: 43, longitude: -70 }) {
  const routes = new Map();
  registerIlsApproachRoutes(
    { get: (path, handler) => routes.set(path, handler) },
    database,
    location,
  );
  return routes.get("/api/ils");
}

test("returns approaches for a valid range band", async () => {
  const approaches = [{ faaId: "PWM", runwayEnd: "11" }];
  const database = { findIlsApproaches: jest.fn(() => approaches) };
  expect(await route(database)({ query: { minRangeNm: "10", maxRangeNm: "20" } }, {})).toEqual(
    approaches,
  );
  expect(database.findIlsApproaches).toHaveBeenCalledWith({ latitude: 43, longitude: -70 }, 10, 20);
});

test("rejects invalid ranges and missing database", async () => {
  const reply = {
    code: jest.fn(function (status) {
      this.status = status;
      return this;
    }),
    send: jest.fn(),
  };
  await route({ findIlsApproaches: jest.fn() })({ query: { maxRangeNm: "301" } }, reply);
  expect(reply.code).toHaveBeenCalledWith(400);
  await route(null)({ query: { maxRangeNm: "20" } }, reply);
  expect(reply.code).toHaveBeenLastCalledWith(503);
});

test("rejects a missing home location", async () => {
  const reply = {
    code: jest.fn(function (status) {
      this.status = status;
      return this;
    }),
    send: jest.fn(),
  };
  await route({ findIlsApproaches: jest.fn() }, null)({ query: { maxRangeNm: "20" } }, reply);
  expect(reply.code).toHaveBeenCalledWith(503);
  expect(reply.send).toHaveBeenCalledWith({ error: "Home location is not configured." });
});
