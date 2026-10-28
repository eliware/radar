import { expect, test } from "@jest/globals";
import { flightStripTitle } from "../../../../src/cli/flight/strip/title.mjs";

test("splits the title row at a viable column boundary", () => {
  const widths = [12, 18, 12, 14, 10, 18, 12, 12];
  const { lines, splitAfter } = flightStripTitle(widths, 1, 180);
  expect(splitAfter).toBeGreaterThan(0);
  expect(splitAfter).toBeLessThan(widths.length);
  expect(lines[0].startsWith("╔")).toBe(true);
  expect(lines[1]).toContain("RADAR CLI");
});

test("truncates long aircraft counts to fit narrow title rows", () => {
  const { lines } = flightStripTitle([4, 4, 2], 123456789, 20);
  expect(lines[1]).toContain("…");
  expect(lines.every((line) => line.length === 20)).toBe(true);
});
