import { expect, test } from "@jest/globals";
import { flightStripHeader } from "../../../../src/cli/flight/strip/frame.mjs";
import { createFlightStripLayout } from "../../../../src/cli/flight/strip/layout-selection.mjs";

test("builds the flight-strip title and column headings", () => {
  const lines = flightStripHeader(createFlightStripLayout(180), 2, 180);
  expect(lines[1]).toContain("RADAR CLI");
  expect(lines[1]).toContain("2 AIRCRAFT");
  expect(lines[3]).toContain("CALLSIGN");
});
