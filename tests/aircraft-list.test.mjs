import { expect, test } from "@jest/globals";
import { createAircraftList } from "../src/aircraft-list.mjs";

test("merges aircraft updates and sorts recent records first", () => {
  let now = 1000;
  const list = createAircraftList({ clock: () => now });
  list.update({ icao: "ABC123", callsign: "TEST123" });
  now = 2000;
  const updated = list.update({ icao: "ABC123", altitudeFeet: 12000 });
  now = 3000;
  list.update({ icao: "DEF456", groundSpeedKnots: 210 });
  expect(updated).toEqual({
    icao: "ABC123",
    callsign: "TEST123",
    altitudeFeet: 12000,
    lastSeen: 2000,
  });
  expect(list.list().map(({ icao }) => icao)).toEqual(["DEF456", "ABC123"]);
});

test("keeps earlier values when a later SBS record has empty fields", () => {
  const list = createAircraftList({ clock: () => 1000 });
  list.update({ icao: "ABC123", callsign: "TEST123", altitudeFeet: 12000 });
  expect(list.update({ icao: "ABC123", callsign: null, altitudeFeet: 13000 })).toMatchObject({
    callsign: "TEST123",
    altitudeFeet: 13000,
  });
});

test("sorts aircraft by distance before update time", () => {
  let now = 1000;
  const list = createAircraftList({ clock: () => now });
  list.update({ icao: "FAR123", distanceNauticalMiles: 8 });
  now = 2000;
  list.update({ icao: "NEAR12", distanceNauticalMiles: 2 });
  now = 3000;
  list.update({ icao: "UNKNOWN", distanceNauticalMiles: null });
  expect(list.list().map(({ icao }) => icao)).toEqual(["NEAR12", "FAR123", "UNKNOWN"]);
});

test("removes aircraft after the stale time limit", () => {
  let now = 1000;
  const list = createAircraftList({ clock: () => now, staleAfterMs: 100 });
  list.update({ icao: "ABC123" });
  now = 1100;
  expect(list.list()).toHaveLength(1);
  now = 1101;
  expect(list.list()).toEqual([]);
});

test("uses the default clock and stale time limit", () => {
  const list = createAircraftList();
  expect(list.update({ icao: "ABC123" }).lastSeen).toEqual(expect.any(Number));
  expect(list.list()).toHaveLength(1);
});
