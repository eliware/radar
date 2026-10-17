import { expect, test } from "@jest/globals";
import { renderFlightStrips } from "../../../src/cli/flight/strips.mjs";

const aircraft = {
  callsign: "TEST123",
  icao: "ABC123",
  altitudeFeet: 12000,
  groundSpeedKnots: 250,
  trackDegrees: 31,
  verticalRateFeetPerMinute: -500,
  squawk: "1200",
  latitude: 43.68745965,
  longitude: -70.4425048,
  distanceNauticalMiles: 1.5,
  bearingDegrees: 270,
  lastSeen: 1000,
};

const render = (planes, width) =>
  renderFlightStrips(planes, { now: () => 4000, width, clearScreen: false }).split("\n");

test("renders full headers in a full-width table", () => {
  const rows = render([aircraft], 180);
  expect(rows[0]).toContain("╔");
  expect(rows[1]).toContain("RADAR CLI");
  expect(rows[1]).toContain("1 AIRCRAFT");
  expect(rows[1].endsWith("║")).toBe(true);
  expect(rows[2]).toContain("╤");
  expect(rows[1].indexOf("│")).toBe(rows[2].indexOf("╪"));
  expect(rows[3]).toContain("CALLSIGN");
  expect(rows[3]).toContain("VERTICAL RATE");
  expect(rows[3]).toContain("│");
  expect(rows[4]).toContain("╪");
  expect(rows[5]).toContain("TEST123");
  expect(rows[5]).toContain("12,000 ft");
  expect(rows[5]).toContain("250 kt");
  expect(rows[5]).toContain("│");
  expect(rows[5]).not.toContain("║ ABC123 ║");
  expect(rows.every((row) => row.length === 180)).toBe(true);
  expect(rows[5]).not.toContain("ALTITUDE");
});

test("uses short headers on one aircraft row when the full headers do not fit", () => {
  const rows = render([aircraft], 120);
  expect(rows[3]).toContain("CALL");
  expect(rows[3]).toContain("ALT");
  expect(rows[3]).not.toContain("ALTITUDE");
  expect(rows[5]).toContain("TEST123");
  expect(rows[5]).toContain("1200");
  expect(rows[5]).not.toContain("ALT ");
  expect(rows.every((row) => row.length === 120)).toBe(true);
});

test("uses single horizontal dividers with double outer edges between aircraft rows", () => {
  const rows = render([aircraft, { ...aircraft, icao: "DEF456" }], 180);
  const divider = rows.find((row) => row.startsWith("╟"));
  expect(divider).toContain("┼");
  expect(divider).toContain("─");
  expect(divider).not.toContain("═");
  expect(divider.endsWith("╢")).toBe(true);
});

test("wraps headers and each aircraft into two value-only rows", () => {
  const rows = render([aircraft], 80);
  const plane = rows.findIndex((row) => row.includes("TEST123"));
  expect(rows.filter((row) => row.startsWith("╟"))).toHaveLength(1);
  expect(rows.filter((row) => row.startsWith("║") && row.includes("│"))).toHaveLength(5);
  expect(rows[plane - 1].startsWith("╠")).toBe(true);
  expect(rows[plane + 1]).toContain("1200");
  expect(rows[plane]).not.toContain("ALT ");
  expect(rows[plane + 1]).not.toContain("SQ ");
  expect(rows.every((row) => row.length === 80)).toBe(true);
});

test("wraps headers and each aircraft into three value-only rows", () => {
  const rows = render([aircraft], 40);
  const plane = rows.findIndex((row) => row.includes("TEST123"));
  expect(rows.filter((row) => row.startsWith("╟"))).toHaveLength(2);
  expect(rows[plane - 1]).toBe(`╠${"═".repeat(38)}╣`);
  expect(rows[plane + 1]).toContain("031°");
  expect(rows[plane + 2]).toContain("1.5 nm");
  expect(rows.slice(plane, plane + 3).every((row) => !row.includes("ALT "))).toBe(true);
  expect(rows.every((row) => row.length === 40)).toBe(true);
});

test("keeps empty and very narrow tables inside the terminal", () => {
  const empty = renderFlightStrips([], { width: 80, clearScreen: false }).split("\n");
  expect(empty.join("\n")).toContain("Waiting for aircraft...");
  expect(empty.every((row) => row.length === 80)).toBe(true);
  expect(renderFlightStrips([], { width: "wide", clearScreen: false })).toContain("VERTICAL RATE");
  expect(renderFlightStrips([], { width: 12, clearScreen: false }).split("\n")[0]).toHaveLength(20);
  const narrow = render([aircraft], 20);
  expect(narrow.every((row) => row.length === 20)).toBe(true);
  expect(narrow.slice(7, 10)).toHaveLength(3);
  expect(renderFlightStrips([])).toContain("Waiting for aircraft...");
  const missing = render([{ lastSeen: 1000 }], 120);
  expect(missing.join("\n")).toContain("-   ");
  expect(missing.join("\n")).not.toContain("- kt");
  const nulls = render(
    [
      {
        lastSeen: 1000,
        altitudeFeet: null,
        groundSpeedKnots: null,
        verticalRateFeetPerMinute: null,
        distanceNauticalMiles: null,
      },
    ],
    120,
  );
  expect(nulls.join("\n")).toContain("-   ");
});

test("clears the terminal and limits long field values", () => {
  const output = renderFlightStrips([{ ...aircraft, callsign: "CALLSIGNTOOLONG" }], { width: 180 });
  expect(output.startsWith("\u001b[2J\u001b[H")).toBe(true);
  expect(output).toContain("CALLSIGNTOOL…");
  expect(output).not.toContain("NaN");
});
