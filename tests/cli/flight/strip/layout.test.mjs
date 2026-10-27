import { expect, test } from "@jest/globals";
import {
  createFlightStripLayout,
  flightStripColumns,
  wideTableWidth,
} from "../../../../src/cli/flight/strip/layout.mjs";

const renderedWidth = (layout) =>
  layout[0].widths.reduce((sum, width) => sum + width, 3 * layout[0].widths.length + 1);

test("uses full headers and fills a wide terminal", () => {
  const layout = createFlightStripLayout(180);
  expect(layout).toHaveLength(1);
  expect(layout[0].labels[0]).toBe("CALLSIGN");
  expect(layout[0].labels[5]).toBe("VERTICAL RATE");
  expect(renderedWidth(layout)).toBe(180);
  expect(wideTableWidth).toBe(156);
  expect(flightStripColumns).toHaveLength(11);
});

test("uses short headers for a one-line aircraft table", () => {
  const layout = createFlightStripLayout(120);
  expect(layout).toHaveLength(1);
  expect(layout[0].labels).toContain("ALT");
  expect(layout[0].labels).not.toContain("ALTITUDE");
  expect(renderedWidth(layout)).toBe(120);
  expect(createFlightStripLayout(120, [["CALL123"]])).toHaveLength(1);
});

test("wraps short headers into two evenly spaced rows", () => {
  const layout = createFlightStripLayout(80);
  expect(layout).toHaveLength(2);
  expect(layout[0].labels).toContain("HDG");
  expect(layout[1].labels).toContain("POS");
  expect(layout.every((group) => group.widths.length === group.indices.length)).toBe(true);
  expect(
    layout.every(
      (group) =>
        group.widths.reduce((sum, width) => sum + width, 3 * group.widths.length + 1) === 80,
    ),
  ).toBe(true);
});

test("wraps short headers into three rows on a narrow terminal", () => {
  const layout = createFlightStripLayout(40);
  expect(layout).toHaveLength(3);
  expect(layout[2].labels).toEqual(["RNG", "BRG", "AGE"]);
  expect(renderedWidth(layout)).toBe(40);
});

test("keeps a three-row table inside a very narrow terminal", () => {
  const layout = createFlightStripLayout(20);
  expect(layout).toHaveLength(3);
  expect(renderedWidth(layout)).toBe(20);
  expect(layout.flatMap((group) => group.widths).every((width) => width > 0)).toBe(true);
});
