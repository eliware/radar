import { expect, jest, test } from "@jest/globals";
import { reconcileCanvasRadarSnapshot } from "../../../../../src/frontend/create/canvas/radar/snapshots.mjs";

test("retains snapshot targets, removes stale trails, and updates without drawing", () => {
  const targets = { retain: jest.fn(() => ["OLD"]) };
  const trails = { remove: jest.fn() };
  const updateTarget = jest.fn();
  const aircraft = [{ icao: "A" }, { icao: "B" }];

  expect(reconcileCanvasRadarSnapshot(aircraft, targets, trails, updateTarget)).toBe(aircraft);
  expect(targets.retain).toHaveBeenCalledWith(["A", "B"]);
  expect(trails.remove).toHaveBeenCalledWith(["OLD"]);
  expect(updateTarget.mock.calls).toEqual([
    [aircraft[0], false],
    [aircraft[1], false],
  ]);
});

test("treats non-array snapshots as empty", () => {
  const targets = { retain: jest.fn(() => []) };
  const trails = { remove: jest.fn() };
  const updateTarget = jest.fn();

  expect(reconcileCanvasRadarSnapshot(null, targets, trails, updateTarget)).toEqual([]);
  expect(targets.retain).toHaveBeenCalledWith([]);
  expect(updateTarget).not.toHaveBeenCalled();
});
