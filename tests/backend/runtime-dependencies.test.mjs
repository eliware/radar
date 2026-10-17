import { expect, jest, test } from "@jest/globals";

jest.unstable_mockModule("@eliware/common", () => ({
  createLogger: jest.fn(),
  registerHandlers: jest.fn(),
  registerSignals: jest.fn(),
}));
jest.unstable_mockModule("dotenv", () => ({ config: jest.fn() }));
jest.unstable_mockModule("../../src/backend/aircraft/feed.mjs", () => ({
  createAircraftFeed: jest.fn(),
}));
jest.unstable_mockModule("../../src/backend/server.mjs", () => ({ createRadarServer: jest.fn() }));
jest.unstable_mockModule("../../src/backend/airport/database.mjs", () => ({
  createAirportDatabase: jest.fn(),
}));
jest.unstable_mockModule("../../src/shared/adsb-location.mjs", () => ({
  parseAdsbLocation: jest.fn(),
}));
jest.unstable_mockModule("../../src/backend/adsblol-lookup.mjs", () => ({
  createAdsbLolLookup: jest.fn(),
}));
jest.unstable_mockModule("../../src/backend/aircraft/enrichment/feed.mjs", () => ({
  createAircraftEnrichmentFeed: jest.fn(),
}));
jest.unstable_mockModule("../../src/backend/metar/lookup.mjs", () => ({
  createMetarLookup: jest.fn(),
  parseMetarStations: jest.fn(),
}));

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
    "createAdsbLolLookup",
    "createAircraftEnrichmentFeed",
    "createMetarLookup",
    "parseMetarStations",
  ]);
  expect(
    Object.values(runtimeDependencies).every((dependency) => typeof dependency === "function"),
  ).toBe(true);
});
