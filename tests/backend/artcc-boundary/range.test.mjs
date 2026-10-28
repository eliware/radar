import { expect, test } from "@jest/globals";
import { intersectsRange } from "../../../src/backend/artcc-boundary/range.mjs";

const location = { latitude: 43, longitude: -70 };

test("selects isolated points and segments that intersect the requested range", () => {
  expect(intersectsRange([{ latitude: 43, longitude: -69.5 }], location, 20, 40)).toBe(true);
  expect(intersectsRange([{ latitude: 43, longitude: -69.5 }], location, 0, 20)).toBe(false);
  expect(
    intersectsRange(
      [
        { latitude: 43, longitude: -71 },
        { latitude: 43, longitude: -69 },
      ],
      location,
      0,
      20,
    ),
  ).toBe(true);
  expect(
    intersectsRange(
      [
        { latitude: 43, longitude: -70.5 },
        { latitude: 43, longitude: -69.5 },
      ],
      location,
      30,
      40,
    ),
  ).toBe(false);
});

test("handles repeated vertices and empty boundaries", () => {
  expect(
    intersectsRange(
      [
        { latitude: 43, longitude: -70 },
        { latitude: 43, longitude: -70 },
      ],
      location,
      0,
      1,
    ),
  ).toBe(true);
  expect(intersectsRange([], location, 0, 10)).toBe(false);
});
