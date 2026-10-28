import { expect, jest, test } from "@jest/globals";
import { waterPathIntersectsView } from "../../../../src/frontend/draw/water/viewport-intersection.mjs";

const path = { bounds: { minX: 0, maxX: 10, minZ: 0, maxZ: 10 } };

test("checks projected path bounds against the viewport", () => {
  const project = jest.fn(({ x, z }) => ({ x, y: z }));
  expect(waterPathIntersectsView(path, project, 10, 10)).toBe(true);
  expect(waterPathIntersectsView(path, (point) => ({ x: point.x - 20, y: point.z }), 10, 10)).toBe(
    false,
  );
  expect(waterPathIntersectsView(path, project, undefined, undefined)).toBe(true);
});

test("rejects paths beyond every viewport edge", () => {
  for (const [offsetX, offsetY] of [
    [-20, 5],
    [20, 5],
    [5, -20],
    [5, 20],
  ]) {
    expect(
      waterPathIntersectsView(
        path,
        (point) => ({ x: point.x + offsetX, y: point.z + offsetY }),
        10,
        10,
      ),
    ).toBe(false);
  }
});
