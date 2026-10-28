import { expect, test } from "@jest/globals";
import { projectPredictedAircraftPath } from "../../../../src/frontend/aircraft/near-home/aircraft-path.mjs";

const home = { latitude: 43, longitude: -70 };

test("projects and predicts an aircraft path relative to home elevation", () => {
  const path = projectPredictedAircraftPath(
    {
      latitude: 43.1,
      longitude: -70,
      altitudeFeet: 1000,
      trackDegrees: 0,
      groundSpeedKnots: 120,
      verticalRateFeetPerMinute: 0,
    },
    home,
    400,
  );

  expect(path.start.y).toBeCloseTo(600 / 6076.12);
  expect(path.end.z).toBeLessThan(path.start.z);
});

test("returns null when position projection or prediction is unavailable", () => {
  expect(projectPredictedAircraftPath({ latitude: 43, longitude: -70 }, home)).toBeNull();
  expect(
    projectPredictedAircraftPath({ latitude: 43, longitude: -70, trackDegrees: 0 }, home),
  ).toBeNull();
});
