import { expect, test } from "@jest/globals";
import {
  aircraftDivider,
  flightStripFooter,
  flightStripHeader,
  horizontalRule,
} from "../../src/cli/flight-strip-frame.mjs";
import { createFlightStripLayout } from "../../src/cli/flight-strip-layout.mjs";

test("aligns the title split with its double header border joint", () => {
  const layout = createFlightStripLayout(180);
  const lines = flightStripHeader(layout, 1, 180);
  expect(lines[1].indexOf("│")).toBe(lines[2].indexOf("╪"));
  expect(lines[2]).toContain("╤");
  expect(lines.every((line) => line.length === 180)).toBe(true);
});

test("separates wrapped heading groups with plain single rules", () => {
  const layout = createFlightStripLayout(40);
  const lines = flightStripHeader(layout, 3, 40);
  expect(lines.filter((line) => line.startsWith("╟"))).toEqual([
    horizontalRule(40, "╟", "╢", "─"),
    horizontalRule(40, "╟", "╢", "─"),
  ]);
  expect(lines.at(-1)).toBe(horizontalRule(40, "╠", "╣", "═"));
  expect(lines.every((line) => line.length === 40)).toBe(true);
});

test("keeps a long aircraft count inside a very narrow title row", () => {
  const lines = flightStripHeader(createFlightStripLayout(20), 123456789, 20);
  expect(lines[1]).toContain("…");
  expect(lines.every((line) => line.length === 20)).toBe(true);
});

test("uses column joints for one-line aircraft dividers and the footer", () => {
  const layout = createFlightStripLayout(180);
  expect(aircraftDivider(layout, 180)).toContain("┼");
  expect(flightStripFooter(layout, 180)).toContain("╧");
});

test("uses plain rules for wrapped aircraft dividers and the footer", () => {
  const layout = createFlightStripLayout(40);
  expect(aircraftDivider(layout, 40)).toBe(horizontalRule(40, "╟", "╢", "─"));
  expect(flightStripFooter(layout, 40)).toBe(horizontalRule(40, "╚", "╝", "═"));
});
