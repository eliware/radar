import { expect, test } from "@jest/globals";
import { projectAircraftTargetPosition } from "../../../../src/frontend/aircraft/target/position.mjs";

test("projects aircraft and measures horizontal distance from home", () => {
  const result = projectAircraftTargetPosition(
    { latitude: 43.1, longitude: -70, altitudeFeet: 1200 },
    { latitude: 43, longitude: -70 },
    300,
  );
  expect(result.position.z).toBeLessThan(0);
  expect(result.position.y).toBeCloseTo(900 / 6076.12);
  expect(result.distanceNm).toBeCloseTo(Math.abs(result.position.z));
});

test("rejects an aircraft without a projectable geographic position", () => {
  expect(
    projectAircraftTargetPosition(
      { latitude: Number.NaN, longitude: -70 },
      { latitude: 43, longitude: -70 },
    ),
  ).toBeNull();
});
