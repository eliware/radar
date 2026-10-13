import { expect, jest, test } from "@jest/globals";

jest.unstable_mockModule("@eliware/common", () => ({
  createLogger: jest.fn(),
  registerHandlers: jest.fn(),
  registerSignals: jest.fn(),
}));
jest.unstable_mockModule("dotenv", () => ({ config: jest.fn() }));

const { runtimeDependencies } = await import("../../src/backend/runtime-dependencies.mjs");

test("provides server and feed runtime dependencies", () => {
  expect(Object.keys(runtimeDependencies)).toEqual([
    "loadEnvironment",
    "createLogger",
    "registerHandlers",
    "registerSignals",
    "createAircraftFeed",
    "createRadarServer",
    "createAirportDatabase",
    "parseAdsbLocation",
    "createAdsbdbLookup",
    "createAircraftEnrichmentFeed",
    "createMetarLookup",
    "parseMetarStations",
  ]);
  expect(
    Object.values(runtimeDependencies).every((dependency) => typeof dependency === "function"),
  ).toBe(true);
});
