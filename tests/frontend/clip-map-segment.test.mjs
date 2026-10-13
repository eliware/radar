import { expect, test } from "@jest/globals";
import { clipMapSegment } from "../../src/frontend/clip-map-segment.mjs";

test("keeps a segment inside the selected radar range", () => {
  expect(clipMapSegment({ x: 1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 }, 3)).toEqual([
    { x: 1, y: 0, z: 0 },
    { x: 2, y: 0, z: 0 },
  ]);
});

test("clips a segment at both sides of the radar range", () => {
  expect(clipMapSegment({ x: -2, y: 1, z: 0 }, { x: 2, y: 1, z: 0 }, 1)).toEqual([
    { x: -1, y: 1, z: 0 },
    { x: 1, y: 1, z: 0 },
  ]);
});

test("rejects a segment outside the radar range", () => {
  expect(clipMapSegment({ x: 2, y: 0, z: 2 }, { x: 3, y: 0, z: 2 }, 1)).toBeNull();
});

test.each([
  [
    { x: 2, y: 0, z: 0 },
    { x: 3, y: 0, z: 0 },
  ],
  [
    { x: -3, y: 0, z: 0 },
    { x: -2, y: 0, z: 0 },
  ],
])("rejects a segment beyond either end of the range", (start, end) => {
  expect(clipMapSegment(start, end, 1)).toBeNull();
});

test("rejects a zero-length segment", () => {
  const point = { x: 0, y: 0, z: 0 };
  expect(clipMapSegment(point, point, 1)).toBeNull();
});
