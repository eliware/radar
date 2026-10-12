import { expect, jest, test } from "@jest/globals";
import { registerNavaidRoutes } from "../../src/backend/navaid-routes.mjs";

function route(database, location = { latitude: 43, longitude: -70 }) {
  const routes = new Map();
  registerNavaidRoutes({ get: (path, handler) => routes.set(path, handler) }, database, location);
  return routes.get("/api/navaids");
}

test("returns navaids in the requested range band", async () => {
  const navaids = [{ identifier: "ENE" }];
  const database = { findNavaidsBetween: jest.fn(() => navaids) };
  const result = await route(database)({ query: { minRangeNm: "20", maxRangeNm: "30" } }, {});
  expect(database.findNavaidsBetween).toHaveBeenCalledWith(
    { latitude: 43, longitude: -70 },
    20,
    30,
  );
  expect(result).toEqual(navaids);
});

test("rejects invalid ranges and missing data", async () => {
  const reply = {
    code: jest.fn(function (status) {
      this.status = status;
      return this;
    }),
    send: jest.fn(),
  };
  await route({ findNavaidsBetween: jest.fn() })({ query: { maxRangeNm: "301" } }, reply);
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
  await route({ findNavaidsBetween: jest.fn() }, null)({ query: { maxRangeNm: "20" } }, reply);
  expect(reply.code).toHaveBeenCalledWith(503);
  expect(reply.send).toHaveBeenCalledWith({ error: "Home location is not configured." });
});
