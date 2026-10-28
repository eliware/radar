import { expect, test } from "@jest/globals";
import { buildFlightStripRows } from "../../../../../src/frontend/flight/strip/layout/rows.mjs";

test("aligns selected groups and maps each row to its labels", () => {
  const result = buildFlightStripRows(
    [["A", "B", "C", "D", "E", "", "G", "H", "I"]],
    ["A", "B", "C", "D", "E", "", "G", "H", "I"],
    [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8],
    ],
  );
  expect(result.alignedGroups).toEqual([
    [0, 1, 2, 3, 4],
    [6, 7, 8, null, null],
  ]);
  expect(result.rows[0].groups[1]).toEqual(["G", "H", "I", "", ""]);
  expect(result.rows[0].labels[1]).toEqual(["G", "H", "I", "", ""]);
});
test("preserves the blank field in three-row groups", () => {
  const groups = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];
  const result = buildFlightStripRows([], [], groups);
  expect(result.rowCount).toBe(3);
  expect(result.alignedGroups).toEqual(groups);
  expect(result.rows).toEqual([]);
});
