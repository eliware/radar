import { expect, jest, test } from "@jest/globals";
import { createAircraftTrails } from "../../../../../src/frontend/aircraft/trails.mjs";
import { createRadarTargets } from "../../../../../src/frontend/radar/targets.mjs";
import { updateCanvasRadarTarget } from "../../../../../src/frontend/create/canvas/radar/targets.mjs";
import { updateCanvasRadarRemoteTargets } from "../../../../../src/frontend/create/canvas/radar/remote-targets.mjs";
import { listCanvasRadarTargets } from "../../../../../src/frontend/create/canvas/radar/list-targets.mjs";

const location = { latitude: 43, longitude: -70 };

test("updates valid targets and leaves invalid targets unchanged", () => {
  const targets = createRadarTargets();
  const trails = createAircraftTrails();
  expect(
    updateCanvasRadarTarget({ icao: "A", latitude: 43, longitude: -69 }, location, targets, trails),
  ).toBeTruthy();
  expect(
    updateCanvasRadarTarget(
      { icao: "BAD", latitude: Number.NaN, longitude: -70 },
      location,
      targets,
      trails,
    ),
  ).toBeFalsy();
  expect(targets.items().has("A")).toBe(true);
  expect(listCanvasRadarTargets(targets, trails).has("A")).toBe(true);
});

test("prunes expired targets when a newer local target arrives", () => {
  jest.useFakeTimers().setSystemTime(1_000_000);
  try {
    const targets = createRadarTargets();
    const trails = createAircraftTrails();
    updateCanvasRadarTarget(
      { icao: "OLD", latitude: 43, longitude: -69 },
      location,
      targets,
      trails,
    );
    jest.setSystemTime(1_120_001);
    updateCanvasRadarTarget(
      { icao: "NEW", latitude: 43, longitude: -69.5 },
      location,
      targets,
      trails,
    );
    expect(targets.items().has("OLD")).toBe(false);
    expect(trails.get("OLD")).toEqual([]);
  } finally {
    jest.useRealTimers();
  }
});

test("keeps only remote targets and updates them without adding trails", () => {
  const targets = createRadarTargets();
  const trails = createAircraftTrails();
  const draw = jest.fn();
  updateCanvasRadarTarget(
    { icao: "LOCAL-OLD", latitude: 43, longitude: -69 },
    location,
    targets,
    trails,
  );
  updateCanvasRadarTarget(
    { icao: "REMOTE-OLD", latitude: 43, longitude: -69, remoteOnly: true },
    location,
    targets,
    trails,
  );
  updateCanvasRadarRemoteTargets(
    [
      { icao: "REMOTE", latitude: 43.1, longitude: -68.5, remoteOnly: true },
      { icao: "LOCAL", latitude: 43.2, longitude: -70, remoteOnly: false },
      { icao: "BAD", latitude: Number.NaN, longitude: -70, remoteOnly: true },
    ],
    location,
    targets,
    trails,
  );
  draw();
  expect(targets.items().has("LOCAL-OLD")).toBe(true);
  expect(targets.items().has("REMOTE-OLD")).toBe(false);
  expect(targets.items().has("LOCAL")).toBe(false);
  expect(targets.items().has("REMOTE")).toBe(true);
  expect(trails.get("REMOTE")).toEqual([]);
  expect(draw).toHaveBeenCalledTimes(1);
});
