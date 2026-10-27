import { expect, jest, test } from "@jest/globals";
import { createMergedAircraftClients } from "../../../../src/backend/aircraft/merged/clients.mjs";

test("tracks per-client radius and local-only filters for snapshots", () => {
  const clients = createMergedAircraftClients(10);
  const local = jest.fn();
  const remote = jest.fn();
  clients.add("local", local);
  clients.add("remote", remote);
  expect(clients.size).toBe(2);
  expect(clients.setRadius("local", 4.2)).toBe(5);
  expect(clients.setRadius("missing", 5)).toBeUndefined();
  expect(clients.setRadius("remote", Number.NaN)).toBeUndefined();
  expect(clients.setLocalOnly("missing", true)).toBe(false);
  expect(clients.setLocalOnly("local", "true")).toBe(false);
  expect(clients.setLocalOnly("local", true)).toBe(true);
  const aircraft = [
    { icao: "LOCAL", distanceNauticalMiles: 4, remoteOnly: false },
    { icao: "REMOTE", distanceNauticalMiles: 4, remoteOnly: true },
    { icao: "FAR", distanceNauticalMiles: 12, remoteOnly: false },
    { icao: "UNKNOWN", remoteOnly: true },
  ];
  clients.publish(aircraft, 4);
  expect(local.mock.calls[0][0].aircraft.map(({ icao }) => icao)).toEqual(["LOCAL"]);
  expect(remote.mock.calls[0][0].aircraft.map(({ icao }) => icao)).toEqual(["LOCAL", "REMOTE"]);
  expect(remote.mock.calls[0][0].localFurthestDistanceNm).toBe(4);
});

test("clamps radius and removes or clears client registrations", () => {
  const clients = createMergedAircraftClients(400);
  clients.add("one", jest.fn());
  expect(clients.setRadius("one", 500)).toBe(300);
  expect(clients.remove("one")).toBe(true);
  expect(clients.remove("one")).toBe(false);
  clients.add("two", jest.fn());
  clients.clear();
  expect(clients.size).toBe(0);
});
