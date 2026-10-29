import { expect, test } from "@jest/globals";
import { createFlightStripLayout } from "../../../../src/cli/flight/strip/layout-selection.mjs";

test("uses full headers and fills a wide terminal", () => {
  const layout = createFlightStripLayout(180);
  expect(layout).toHaveLength(1);
  expect(layout[0].labels[0]).toBe("CALLSIGN");
  expect(layout[0].labels[5]).toBe("VERTICAL RATE");
});

test("uses short headers for a one-line aircraft table", () => {
  const layout = createFlightStripLayout(120);
  expect(layout).toHaveLength(1);
  expect(layout[0].labels).toContain("ALT");
  expect(layout[0].labels).not.toContain("ALTITUDE");
  expect(createFlightStripLayout(120, [["CALL123"]])).toHaveLength(1);
});

test("wraps short headers into two evenly spaced rows", () => {
  const layout = createFlightStripLayout(80);
  expect(layout).toHaveLength(2);
  expect(layout[0].labels).toContain("HDG");
  expect(layout[1].labels).toContain("POS");
  expect(layout.every((group) => group.widths.length === group.indices.length)).toBe(true);
});

test("wraps short headers into three rows on a narrow terminal", () => {
  const layout = createFlightStripLayout(40);
  expect(layout).toHaveLength(3);
  expect(layout[2].labels).toEqual(["RNG", "BRG", "AGE"]);
});

test("keeps a three-row table inside a very narrow terminal", () => {
  const layout = createFlightStripLayout(20);
  expect(layout).toHaveLength(3);
  expect(layout.flatMap((group) => group.widths).every((width) => width > 0)).toBe(true);
});
