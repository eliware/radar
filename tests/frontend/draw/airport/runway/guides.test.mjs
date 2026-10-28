import { expect, test } from "@jest/globals";
import { createRunwayGuidePoints } from "../../../../../src/frontend/draw/airport/runway/guides.mjs";

test("builds extension and base-leg guide points at their required elevations", () => {
  const end = { latitude: 43, longitude: -70, elevationFeet: 100, alignmentDegrees: 90 };
  const guide = createRunwayGuidePoints(end);
  expect(guide.extensionStart).toEqual({ ...end });
  expect(guide.extensionEnd.elevationFeet).toBe(3100);
  expect(guide.extensionEnd.longitude).toBeLessThan(end.longitude);
  expect(guide.baseLegs).toHaveLength(2);
  expect(guide.baseLegs.map(({ elevationFeet }) => elevationFeet)).toEqual([3100, 3100]);
  expect(guide.baseLegs[0].latitude).not.toBe(guide.baseLegs[1].latitude);
});

test("uses zero feet when the runway end has no finite elevation", () => {
  const guide = createRunwayGuidePoints({
    latitude: 43,
    longitude: -70,
    elevationFeet: NaN,
    alignmentDegrees: 0,
  });
  expect(guide.extensionStart.elevationFeet).toBe(0);
  expect(guide.extensionEnd.elevationFeet).toBe(3000);
  expect(guide.baseLegs.map(({ elevationFeet }) => elevationFeet)).toEqual([3000, 3000]);
});
