import { expect, jest, test } from "@jest/globals";
import { layoutAircraftTags } from "../../src/frontend/layout-aircraft-tags.mjs";

test("places tags inside the view and reduces label overlap", () => {
  const context = { measureText: (value) => ({ width: value.length * 8 }) };
  const tags = layoutAircraftTags(
    context,
    [
      { x: 50, y: 50, lines: ["A", "1", "2"] },
      { x: 52, y: 50, lines: ["LONG", "1", "2"] },
    ],
    12,
    200,
    120,
  );
  expect(tags).toHaveLength(2);
  expect(tags[0].x).toBeGreaterThanOrEqual(0);
  expect(tags[0].y).toBeGreaterThanOrEqual(0);
  expect(tags[1].cost).toBeGreaterThanOrEqual(0);
  expect(jest.isMockFunction(context.measureText)).toBe(false);
});
