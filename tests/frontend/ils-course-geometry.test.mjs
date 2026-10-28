import { expect, test } from "@jest/globals";
import { buildIlsCourseGeometry } from "../../src/frontend/ils-course-geometry.mjs";

const approach = {
  latitude: 43,
  longitude: -70,
  elevationFeet: 100,
  magneticCourse: 100,
  magneticVariation: 10,
  magneticVariationHemisphere: "W",
  glideSlopeDegrees: 3,
};

test("corrects west magnetic variation and builds a rising ten-mile endpoint", () => {
  const result = buildIlsCourseGeometry(approach);
  expect(result.bearing).toBe(270);
  expect(result.endpoint.longitude).toBeLessThan(approach.longitude);
  expect(result.endpoint.elevationFeet).toBeGreaterThan(approach.elevationFeet);
  expect(result.elevationFeet).toBe(100);
});

test("uses east variation, zero variation, and flat-path fallbacks", () => {
  const east = buildIlsCourseGeometry({
    ...approach,
    magneticVariationHemisphere: "E",
    glideSlopeDegrees: Number.NaN,
    elevationFeet: Number.NaN,
  });
  expect(east.bearing).toBe(290);
  expect(east.endpoint.elevationFeet).toBe(0);
  const noVariation = buildIlsCourseGeometry({
    ...approach,
    magneticCourse: 180,
    magneticVariation: Number.NaN,
    magneticVariationHemisphere: "X",
  });
  expect(noVariation.bearing).toBe(0);
  expect(buildIlsCourseGeometry({ ...approach, magneticCourse: Number.NaN })).toBeNull();
});
