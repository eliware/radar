import { expect, test } from "@jest/globals";
import { labelProcedurePaths } from "../../src/backend/label-procedure-paths.mjs";

const path = (type, portionType, code, fixes) => ({
  type,
  portionType,
  code,
  points: fixes.map((fix) => ({ fix, label: false })),
});

test("keeps unmatched STAR bodies and unrelated paths without main-fix labels", () => {
  const bodyA = path("STAR", "BODY", "STAR2", ["ONLY-A"]);
  const bodyB = path("STAR", "BODY", "STAR2", ["ONLY-B"]);
  const other = path("ILS", "BODY", "ILS1", ["A", "B"]);
  labelProcedurePaths([bodyA, bodyB, other]);
  expect(bodyA.points[0].label).toBe(true);
  expect(bodyB.points[0].label).toBe(true);
  expect(other.points.every(({ label }) => !label)).toBe(true);
});

test("accepts an empty path list", () => {
  expect(labelProcedurePaths([])).toBeUndefined();
});
