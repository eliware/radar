import { expect, jest, test } from "@jest/globals";
import { createRadarScopePath } from "../../src/frontend/create-radar-scope-path.mjs";

test("projects 64 points on the visible radar range", () => {
  const project = jest.fn((point) => ({ x: point.x, y: point.z }));
  const path = createRadarScopePath(10, project);
  expect(path).toHaveLength(64);
  expect(path[0]).toEqual({ x: 10, y: 0 });
  expect(path[16].x).toBeCloseTo(0);
  expect(path[16].y).toBeCloseTo(10);
  expect(project).toHaveBeenCalledTimes(64);
});
