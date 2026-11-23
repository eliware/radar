import { expect, jest, test } from "@jest/globals";
import { default as updateAircraftTargetAndTrail } from "../../../../src/frontend/aircraft/target/updates.mjs";

const location = { latitude: 43, longitude: -70 };

test("updates target, trail, and receive-time state", () => {
  const aircraft = { icao: "ABC123", latitude: 43.1, longitude: -70, lastSeen: 10 };
  const targets = { update: jest.fn(() => ["EXPIRED"]) };
  const trails = { remove: jest.fn(), add: jest.fn() };
  const receiveTimes = { remove: jest.fn(), set: jest.fn() };
  updateAircraftTargetAndTrail({
    aircraft,
    location,
    elevationFeet: 300,
    targets,
    trails,
    receiveTimes,
  });
  expect(targets.update).toHaveBeenCalledWith(aircraft, expect.any(Number));
  expect(trails.remove).toHaveBeenCalledWith(["EXPIRED"]);
  expect(trails.add).toHaveBeenCalledWith("ABC123", expect.any(Object));
  expect(receiveTimes.set).toHaveBeenCalledWith("ABC123", 10);
});

test("rejects invalid positions without changing targets or trails", () => {
  const targets = { update: jest.fn() };
  const trails = { remove: jest.fn(), add: jest.fn() };
  expect(
    updateAircraftTargetAndTrail({
      aircraft: { icao: "BAD", latitude: Number.NaN, longitude: -70 },
      location,
      targets,
      trails,
    }),
  ).toBeNull();
  expect(targets.update).not.toHaveBeenCalled();
  expect(trails.add).not.toHaveBeenCalled();
});

test("can update remote targets without recording local trails", () => {
  const aircraft = { icao: "REMOTE", latitude: 43.1, longitude: -70 };
  const targets = { update: jest.fn(() => []) };
  const trails = { remove: jest.fn(), add: jest.fn() };
  updateAircraftTargetAndTrail({
    aircraft,
    location,
    targets,
    trails,
    addTrail: false,
    removeExpiredTrails: false,
  });
  expect(targets.update).toHaveBeenCalledTimes(1);
  expect(trails.add).not.toHaveBeenCalled();
  expect(trails.remove).not.toHaveBeenCalled();
});
