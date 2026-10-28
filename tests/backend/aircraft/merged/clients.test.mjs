import { expect, jest, test } from "@jest/globals";
import { createMergedAircraftClients } from "../../../../src/backend/aircraft/merged/clients.mjs";

test("tracks client settings and publishes aircraft snapshots", () => {
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
  const aircraft = [{ icao: "LOCAL", distanceNauticalMiles: 4, remoteOnly: false }];
  clients.publish(aircraft, 4);
  expect(local).toHaveBeenCalledWith({
    event: "aircraft-snapshot",
    aircraft,
    localFurthestDistanceNm: 4,
  });
  expect(remote).toHaveBeenCalledWith({
    event: "aircraft-snapshot",
    aircraft,
    localFurthestDistanceNm: 4,
  });
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
