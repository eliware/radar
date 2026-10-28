import { expect, test } from "@jest/globals";
import { createMergedAircraftSourceState } from "../../../../../src/backend/aircraft/merged/aircraft/source-state.mjs";

test("normalizes source records and removes records after replacement", () => {
  const entries = new Map();
  const state = createMergedAircraftSourceState(entries);
  state.set("local", { icao: " abc123 " });
  state.replace("remote", [{ icao: "abc123" }, { icao: "remote1" }, { icao: " " }]);
  expect([...entries.keys()]).toEqual(["ABC123", "REMOTE1"]);
  state.replace("remote", []);
  expect([...entries.keys()]).toEqual(["ABC123"]);
  state.replace("local", []);
  expect(entries.size).toBe(0);
});
