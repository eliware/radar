import { expect, jest, test } from "@jest/globals";
import { createAircraftClientState } from "../../../src/backend/aircraft/client-state.mjs";

test("tracks client settings, preserves senders on reconnect, and filters snapshots", () => {
  const clients = createAircraftClientState(10);
  const send = jest.fn();
  clients.connect("local", send);
  clients.connect("remote");
  clients.connect("local");
  expect(clients.size).toBe(2);
  expect(clients.setRadius("local", 4.2)).toBe(5);
  expect(clients.setRadius("missing", 5)).toBeUndefined();
  expect(clients.setRadius("remote", Number.NaN)).toBeUndefined();
  expect(clients.setLocalOnly("missing", true)).toBe(false);
  expect(clients.setLocalOnly("local", "true")).toBe(false);
  expect(clients.setLocalOnly("local", true)).toBe(true);
  expect(clients.settings()).toEqual([
    { radiusNm: 5, localOnly: true },
    { radiusNm: 10, localOnly: false },
  ]);
  const aircraft = [
    { icao: "LOCAL", distanceNauticalMiles: 4, remoteOnly: false },
    { icao: "REMOTE", distanceNauticalMiles: 4, remoteOnly: true },
  ];
  clients.publish(aircraft, 4);
  expect(send).toHaveBeenCalledWith({
    event: "aircraft-snapshot",
    aircraft: [aircraft[0]],
    localFurthestDistanceNm: 4,
  });
});

test("clamps radii and removes or clears clients", () => {
  const clients = createAircraftClientState(400, 300);
  clients.connect("one", jest.fn());
  expect(clients.settings()[0].radiusNm).toBe(300);
  expect(clients.setRadius("one", 500)).toBe(300);
  expect(clients.disconnect("one")).toBe(true);
  expect(clients.disconnect("one")).toBe(false);
  clients.connect("two");
  clients.clear();
  expect(clients.size).toBe(0);
  expect(clients.settings()).toEqual([]);
});
