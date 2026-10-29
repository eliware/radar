import { expect, test } from "@jest/globals";
import { createFlightStripAircraftStore } from "../../../src/frontend/flight/aircraft-store.mjs";

const item = (icao, options = {}) => ({ icao, distanceNauticalMiles: 1, ...options });

test("updates collections and classifies retained aircraft", () => {
  const store = createFlightStripAircraftStore(() => 1000);
  store.update([item("FRESH", { lastSeen: 1000 }), item("OLD", { lastSeen: 0 }), {}]);
  store.update(item("SECOND", { lastSeen: 1000 }));
  const visible = store.list(null, 0, 120001);
  expect(visible.map(({ icao }) => icao)).toEqual(["FRESH", "SECOND"]);
});

test("reconciles remote aircraft and replaces snapshot state", () => {
  const store = createFlightStripAircraftStore();
  store.updateRemote([item("REMOTE", { remoteOnly: true }), item("LOCAL", { remoteOnly: false })]);
  store.updateRemote([item("LOCAL", { remoteOnly: false, callsign: "updated" })]);
  expect(store.list(null, 0).map(({ icao }) => icao)).toEqual(["LOCAL"]);
  store.replace([item("SNAPSHOT"), {}]);
  expect(store.list(null, 0).map(({ icao }) => icao)).toEqual(["SNAPSHOT"]);
  store.replace(null);
  expect(store.list(null, 0)).toEqual([]);
});
