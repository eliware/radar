import { expect, jest, test } from "@jest/globals";
import { default as registerNavaidRoutes } from "../../src/backend/navaid-routes.mjs";

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
