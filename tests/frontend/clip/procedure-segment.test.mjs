import { expect, test } from "@jest/globals";
import { clipProcedureSegment } from "../../../src/frontend/clip/procedure-segment.mjs";

const point = (x, rangeNm) => ({ rangeNm, screen: { x, y: x * 2 } });

test("keeps a segment with both endpoints inside the view", () => {
  const from = point(1, 5);
  const to = point(2, 8);
  expect(clipProcedureSegment(from, to, 10)).toEqual({ from: from.screen, to: to.screen });
});

test("drops a segment with both endpoints outside the view", () => {
  expect(clipProcedureSegment(point(1, 11), point(2, 12), 10)).toBeNull();
});

test("clips the start when the segment enters the view", () => {
  expect(clipProcedureSegment(point(0, 12), point(2, 8), 10)).toEqual({
    from: { x: 1, y: 2 },
    to: { x: 2, y: 4 },
  });
});

test("clips the end when the segment leaves the view", () => {
  expect(clipProcedureSegment(point(0, 8), point(2, 12), 10)).toEqual({
    from: { x: 0, y: 0 },
    to: { x: 1, y: 2 },
  });
});
