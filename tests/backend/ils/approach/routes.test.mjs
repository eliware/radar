import { expect, jest, test } from "@jest/globals";
import { default as registerIlsApproachRoutes } from "../../../../src/backend/ils/approach/routes.mjs";

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
