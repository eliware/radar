import { expect, test } from "@jest/globals";
import { buildFlightStripLayout } from "../../../../src/frontend/flight/strip/layout.mjs";

const labels = [
  "CALLSIGN",
  "ALTITUDE / VS",
  "TYPE",
  "HEADING / SPEED",
  "SQUAWK",
  "",
  "BEARING / RANGE",
  "ORIGIN",
  "DESTINATION",
];
const values = [["RADAR1", "125-06", "B738", "009°200", "1200", "", "007°4", "KPWM", "KBOS"]];

test("uses one row when all values fit and returns matching labels", () => {
  const result = buildFlightStripLayout(values, 3000, labels);
  expect(result.alignedGroups).toEqual([[0, 1, 2, 3, 4, 6, 7, 8]]);
  expect(result.rows[0].groups[0]).toEqual(values[0].filter((_, index) => index !== 5));
  expect(result.rows[0].labels[0]).toEqual(labels.filter((_, index) => index !== 5));
  expect(result.rowCount).toBe(1);
});

test("uses two or three aligned rows as the available width shrinks", () => {
  const two = buildFlightStripLayout(values, 500, labels);
  const three = buildFlightStripLayout(values, 250, labels);
  expect(two.alignedGroups).toEqual([
    [0, 1, 2, 3, 4],
    [6, 7, 8, null, null],
  ]);
  expect(three.alignedGroups).toEqual([
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ]);
  expect(two.rowCount).toBe(2);
  expect(three.rowCount).toBe(3);
  expect(two.rows[0].groups.every((group) => group.length === 5)).toBe(true);
  expect(two.rows[0].groups[1].slice(0, 3)).toEqual(["007°4", "KPWM", "KBOS"]);
  expect(three.rows[0].groups[1][2]).toBe("");
  expect(three.rows[0].groups).toHaveLength(3);
});

test("supports empty aircraft values with the narrow layout", () => {
  const result = buildFlightStripLayout([], 0, labels);
  expect(result.alignedGroups).toHaveLength(3);
  expect(result.rows).toEqual([]);
});
