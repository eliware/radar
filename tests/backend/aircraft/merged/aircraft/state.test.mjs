import { expect, test } from "@jest/globals";
import { createMergedAircraftState } from "../../../../../src/backend/aircraft/merged/aircraft/state.mjs";

test("coordinates source updates and reconciles replaced entries", () => {
  const state = createMergedAircraftState();
  state.replaceRemote([{ icao: "REMOTE1" }, { icao: " " }]);
  state.replaceLocal([{ icao: "LOCAL1" }]);
  state.setLocal({ icao: "LOCAL2" });
  expect(state.list().map(({ icao }) => icao)).toEqual(["REMOTE1", "LOCAL1", "LOCAL2"]);
  state.replaceLocal([]);
  expect(state.list()).toEqual([{ icao: "REMOTE1", remoteOnly: true }]);
  state.replaceRemote([]);
  expect(state.list()).toEqual([]);
});
