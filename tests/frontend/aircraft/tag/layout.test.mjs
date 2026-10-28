import { expect, test } from "@jest/globals";
import { placementCost, tagCandidates } from "../../../../src/frontend/aircraft/tag/layout.mjs";

test("generates candidate positions around an aircraft marker", () => {
  expect(tagCandidates({ x: 50, y: 60 }, 20, 10)).toEqual([
    { x: 62, y: 38 },
    { x: 62, y: 72 },
    { x: 18, y: 38 },
    { x: 18, y: 72 },
    { x: 40, y: 38 },
    { x: 40, y: 72 },
  ]);
});

test("scores viewport overflow and overlap", () => {
  const placed = [{ x: 10, y: 10, width: 10, height: 10 }];
  expect(placementCost({ x: 12, y: 12 }, 5, 5, 100, 100, placed)).toBe(25);
  expect(placementCost({ x: -2, y: 90 }, 15, 20, 100, 100, [])).toBe(12000);
});
