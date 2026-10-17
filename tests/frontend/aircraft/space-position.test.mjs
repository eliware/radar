import { expect, test } from "@jest/globals";
import { projectAircraftPosition } from "../../../src/frontend/aircraft/space-position.mjs";

test("projects aircraft coordinates and altitude around the home origin", () => {
  const position = projectAircraftPosition(
    { latitude: 1, longitude: 1, altitudeFeet: 6376.12 },
    { latitude: 0, longitude: 0 },
    300,
  );
  expect(position.x).toBeCloseTo(60.04, 1);
  expect(position.y).toBeCloseTo(1, 2);
  expect(position.z).toBeCloseTo(-60.04, 1);
});

test("uses the home elevation when aircraft altitude is absent", () => {
  const position = projectAircraftPosition(
    { latitude: 0, longitude: 0 },
    { latitude: 0, longitude: 0 },
    300,
  );
  expect(position.x).toBe(0);
  expect(position.y).toBe(0);
  expect(position.z).toBeCloseTo(0);
});

test.each([
  [null, { latitude: 0, longitude: 0 }],
  [
    { latitude: NaN, longitude: 0 },
    { latitude: 0, longitude: 0 },
  ],
  [
    { latitude: 0, longitude: NaN },
    { latitude: 0, longitude: 0 },
  ],
  [{ latitude: 0, longitude: 0 }, null],
])("ignores aircraft without valid coordinates", (aircraft, location) => {
  expect(projectAircraftPosition(aircraft, location, 300)).toBeNull();
});
