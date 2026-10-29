import { expect, test } from "@jest/globals";
import { isValidRunwayEnd } from "../../../../src/backend/airport/runway/valid-end.mjs";

const validEnd = { latitude: 43, longitude: -70, alignmentDegrees: 90 };

test("accepts runway ends with finite coordinates and alignment", () => {
  expect(isValidRunwayEnd(validEnd)).toBe(true);
});

test.each([
  { ...validEnd, latitude: Number.NaN },
  { ...validEnd, longitude: Number.POSITIVE_INFINITY },
  { ...validEnd, alignmentDegrees: Number.NaN },
])("rejects runway ends with invalid coordinates or alignment", (end) => {
  expect(isValidRunwayEnd(end)).toBe(false);
});
