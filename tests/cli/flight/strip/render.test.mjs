import { expect, test } from "@jest/globals";
import { createFlightStripLayout } from "../../../../src/cli/flight/strip/layout-selection.mjs";
import { renderFlightStripFrame } from "../../../../src/cli/flight/strip/render.mjs";
import { horizontalRule } from "../../../../src/cli/flight/strip/rule.mjs";

test("aligns title, header, aircraft rows, and footer in a full-width frame", () => {
  const layout = createFlightStripLayout(180);
  const lines = renderFlightStripFrame([Array(11).fill("value")], layout, 1, 180);
  expect(lines[1].indexOf("│")).toBe(lines[2].indexOf("╪"));
  expect(lines[2]).toContain("╤");
  expect(lines[3]).toContain("CALLSIGN");
  expect(lines[4]).toContain("╪");
  expect(lines[5]).toContain("value");
  expect(lines.at(-1)).toContain("╧");
  expect(lines.every((line) => line.length === 180)).toBe(true);
});

test("renders wrapped header groups and divides multirow aircraft with plain rules", () => {
  const layout = createFlightStripLayout(40);
  const lines = renderFlightStripFrame(
    [Array(11).fill("value"), Array(11).fill("next")],
    layout,
    2,
    40,
  );
  expect(lines.filter((line) => line.startsWith("╟"))).toEqual([
    horizontalRule(40, "╟", "╢", "─"),
    horizontalRule(40, "╟", "╢", "─"),
    horizontalRule(40, "╟", "╢", "─"),
  ]);
  expect(lines.at(-1)).toBe(horizontalRule(40, "╚", "╝", "═"));
  expect(lines.every((line) => line.length === 40)).toBe(true);
});

test("keeps a long aircraft count inside a narrow title row", () => {
  const lines = renderFlightStripFrame([], createFlightStripLayout(20), 123456789, 20);
  expect(lines[1]).toContain("…");
  expect(lines.every((line) => line.length === 20)).toBe(true);
});
