import { expect, jest, test } from "@jest/globals";
import { projectRadarReference } from "../../../src/frontend/project/radar-reference.mjs";

test("projects reference elevation relative to home", () => {
  const project = jest.fn((point) => ({ x: point.x, y: point.y, z: point.z }));
  const result = projectRadarReference(
    { latitude: 43, longitude: -70, elevationFeet: 910 },
    { latitude: 43, longitude: -70 },
    300,
    project,
  );
  expect(result.x).toBe(0);
  expect(result.y).toBeCloseTo(610 / 6076.12);
  expect(project).toHaveBeenCalledTimes(1);
});

test("uses zero elevation when reference elevation or home location is missing", () => {
  const project = jest.fn((point) => point);
  const result = projectRadarReference(
    { latitude: 43, longitude: -70, elevationFeet: Number.NaN },
    { latitude: 43, longitude: -70 },
    300,
    project,
  );
  expect(result.y).toBeCloseTo(-300 / 6076.12);
  expect(projectRadarReference({ latitude: 43, longitude: -70 }, null, 300, project)).toBeNull();
});
