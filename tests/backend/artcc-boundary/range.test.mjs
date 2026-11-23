import { expect, test } from "@jest/globals";
import { default as createArtccBoundaryRangeFilter } from "../../../src/backend/artcc-boundary/range.mjs";

const location = { latitude: 43, longitude: -70 };

test("selects isolated points and segments that intersect the requested range", () => {
  const isolated = createArtccBoundaryRangeFilter([{ latitude: 43, longitude: -69.5 }], location);
  expect(isolated(20, 40)).toBe(true);
  expect(isolated(0, 20)).toBe(false);

  const crossing = createArtccBoundaryRangeFilter(
    [
      { latitude: 43, longitude: -71 },
      { latitude: 43, longitude: -69 },
    ],
    location,
  );
  expect(crossing(0, 20)).toBe(true);
  expect(crossing(30, 40)).toBe(true);
  const outsideBand = createArtccBoundaryRangeFilter(
    [
      { latitude: 43.333, longitude: -70.456 },
      { latitude: 43.333, longitude: -69.544 },
    ],
    location,
  );
  expect(outsideBand(0, 10)).toBe(false);
});

test("rejects boundaries outside the range bounds and handles repeated vertices", () => {
  const distant = createArtccBoundaryRangeFilter(
    [
      { latitude: 43, longitude: -71 },
      { latitude: 43, longitude: -69 },
    ],
    location,
  );
  expect(distant(0, 10)).toBe(true);
  expect(distant(50, 60)).toBe(false);

  const repeated = createArtccBoundaryRangeFilter(
    [
      { latitude: 43, longitude: -70 },
      { latitude: 43, longitude: -70 },
    ],
    location,
  );
  expect(repeated(0, 1)).toBe(true);
  expect(createArtccBoundaryRangeFilter([], location)(0, 10)).toBe(false);
});

test("skips boundary segments that miss a range despite overlapping bounds", () => {
  const boundary = createArtccBoundaryRangeFilter(
    [
      { latitude: 43.333, longitude: -70.456 },
      { latitude: 43.5, longitude: -70.456 },
      { latitude: 43.5, longitude: -69.544 },
      { latitude: 43.333, longitude: -69.544 },
    ],
    location,
  );
  expect(boundary(0, 25)).toBe(false);
});
