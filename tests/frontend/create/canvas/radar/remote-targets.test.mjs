import { expect, test } from "@jest/globals";
import { createAircraftTrails } from "../../../../../src/frontend/aircraft/trails.mjs";
import { createRadarTargets } from "../../../../../src/frontend/radar/targets.mjs";
import { updateCanvasRadarRemoteTargets } from "../../../../../src/frontend/create/canvas/radar/remote-targets.mjs";

test("updates a remote aircraft without creating a trail", () => {
  const targets = createRadarTargets();
  const trails = createAircraftTrails();
  updateCanvasRadarRemoteTargets(
    [{ icao: "REMOTE", latitude: 43, longitude: -70, remoteOnly: true }],
    { latitude: 43, longitude: -70 },
    targets,
    trails,
  );
  expect(targets.items().has("REMOTE")).toBe(true);
  expect(trails.get("REMOTE")).toEqual([]);
});
