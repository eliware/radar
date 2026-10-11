import { expect, test } from "@jest/globals";
import { predictAircraftPosition } from "../../src/frontend/predict-aircraft-position.mjs";

test("predicts position for 60 seconds of travel and climb", () => {
  const point = predictAircraftPosition(
    { x: 0, y: 0, z: 0 },
    {
      trackDegrees: 0,
      groundSpeedKnots: 3600,
      verticalRateFeetPerMinute: 6076.12,
    },
  );
  expect(point.x).toBeCloseTo(0);
  expect(point.z).toBeCloseTo(-60);
  expect(point.y).toBeCloseTo(1);
  expect(
    predictAircraftPosition(
      { x: 1, y: 2, z: 3 },
      {
        trackDegrees: 180,
        groundSpeedKnots: 0,
      },
    ).y,
  ).toBe(2);
  expect(predictAircraftPosition({}, { trackDegrees: 0 })).toBeNull();
  expect(predictAircraftPosition({}, { groundSpeedKnots: 1 })).toBeNull();
});
