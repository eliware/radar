import { expect, test } from "@jest/globals";
import { renderAircraftRows } from "../../../../src/cli/flight/strip/aircraft-rows.mjs";

test("renders selected aircraft fields and separates multiple aircraft rows", () => {
  const layout = [{ indices: [0, 1], widths: [10, 8] }];
  const lines = renderAircraftRows(
    [
      ["RADAR1", "12500"],
      ["RADAR2", "10000"],
    ],
    layout,
    20,
  );
  expect(lines).toHaveLength(3);
  expect(lines[0]).toContain("RADAR1");
  expect(lines[1]).toContain("╟");
  expect(lines[2]).toContain("RADAR2");
});

test("returns no aircraft rows for an empty list", () => {
  expect(renderAircraftRows([], [{ indices: [], widths: [] }], 20)).toEqual([]);
});
