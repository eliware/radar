import { expect, test } from "@jest/globals";
import { groupBoundaries, intersectsRange } from "../../../src/backend/artcc-boundary/range.mjs";

const location = { latitude: 43, longitude: -70 };
const point = (sequence, latitude, longitude, extra = {}) => ({
  sequence,
  latitude,
  longitude,
  locationId: "ZBW",
  name: "BOSTON",
  altitude: "LOW",
  type: "ARTCC",
  ...extra,
});

test("groups points by boundary identity and keeps only point fields", () => {
  const first = point(1, 43, -70);
  const second = point(2, 44, -70);
  const other = point(1, 40, -70, { locationId: "ZNY", altitude: "HIGH" });
  expect(groupBoundaries([first, second, other])).toEqual(
    new Map([
      [
        "ZBW:LOW:ARTCC",
        {
          locationId: "ZBW",
          name: "BOSTON",
          altitude: "LOW",
          type: "ARTCC",
          points: [
            { sequence: 1, latitude: 43, longitude: -70 },
            { sequence: 2, latitude: 44, longitude: -70 },
          ],
        },
      ],
      [
        "ZNY:HIGH:ARTCC",
        {
          locationId: "ZNY",
          name: "BOSTON",
          altitude: "HIGH",
          type: "ARTCC",
          points: [{ sequence: 1, latitude: 40, longitude: -70 }],
        },
      ],
    ]),
  );
});

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
