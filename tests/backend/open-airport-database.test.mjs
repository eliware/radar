import { expect, jest, test } from "@jest/globals";
import { openAirportDatabase } from "../../src/backend/open-airport-database.mjs";

test("opens an existing database in read-only mode", () => {
  const database = {};
  const Database = jest.fn(() => database);
  const opened = openAirportDatabase("nasr.sqlite", { Database, exists: () => true });
  expect(opened).toBe(database);
  expect(Database).toHaveBeenCalledWith(expect.stringContaining("nasr.sqlite"), {
    readOnly: true,
  });
});

test("resolves the packaged NASR database by default", () => {
  const exists = jest.fn(() => true);
  const database = {};
  const Database = jest.fn(() => database);
  expect(openAirportDatabase(undefined, { Database, exists })).toBe(database);
  expect(exists.mock.calls[0][0]).toMatch(/[\\/]nasr[\\/]NASR_2026_10_01\.sqlite$/);
  expect(Database).toHaveBeenCalledWith(exists.mock.calls[0][0], { readOnly: true });
});

test("keeps a missing default database optional", () => {
  expect(openAirportDatabase(undefined, { exists: () => false })).toBeNull();
});

test("rejects a missing configured database path", () => {
  expect(() => openAirportDatabase("missing.sqlite", { exists: () => false })).toThrow(
    "NASR database file not found",
  );
});

test("uses default open options for a missing configured database", () => {
  expect(() => openAirportDatabase("missing-default-options.sqlite")).toThrow(
    "NASR database file not found",
  );
});
