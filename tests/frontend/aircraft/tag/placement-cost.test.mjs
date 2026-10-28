import { expect, test } from "@jest/globals";
import { placementCost } from "../../../../src/frontend/aircraft/tag/placement-cost.mjs";

test("scores viewport overflow and overlap", () => {
  const placed = [{ x: 10, y: 10, width: 10, height: 10 }];
  expect(placementCost({ x: 12, y: 12 }, 5, 5, 100, 100, placed)).toBe(25);
  expect(placementCost({ x: -2, y: 90 }, 15, 20, 100, 100, [])).toBe(12000);
});
