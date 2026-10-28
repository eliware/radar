import { expect, jest, test } from "@jest/globals";
import { updateAircraftTargetAndTrail } from "../../../src/frontend/aircraft/target-updates.mjs";

const location = { latitude: 43, longitude: -70 };

test("projects aircraft into a target and records its trail", () => {
  const aircraft = { icao: "ABC123", latitude: 43.1, longitude: -70, lastSeen: 10 };
  const targets = { update: jest.fn(() => ["EXPIRED"]) };
  const trails = { remove: jest.fn(), add: jest.fn() };
  const result = updateAircraftTargetAndTrail({
    aircraft,
    location,
    elevationFeet: 300,
    targets,
    trails,
  });
  expect(result.distanceNm).toEqual(expect.any(Number));
  expect(targets.update).toHaveBeenCalledWith(aircraft, result.distanceNm);
  expect(trails.remove).toHaveBeenCalledWith(["EXPIRED"]);
  expect(trails.add).toHaveBeenCalledWith("ABC123", result.position, 10);
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
