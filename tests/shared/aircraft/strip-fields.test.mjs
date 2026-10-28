import { expect, test } from "@jest/globals";
import {
  formatAircraftStripCallsign,
  formatAircraftStripHeading,
  formatAircraftStripSpeed,
} from "../../../src/shared/aircraft/strip-fields.mjs";

test("formats shared flight strip identity, speed, and heading fields", () => {
  expect(formatAircraftStripCallsign({ callsign: " TEST1 " })).toBe("TEST1");
  expect(formatAircraftStripCallsign({ callsign: "UNKNOWN", icao: "ABC123" })).toBe("ABC123");
  expect(formatAircraftStripCallsign({})).toBe("-");
  expect(formatAircraftStripSpeed({ groundSpeedKnots: 123.6 })).toBe("124");
  expect(formatAircraftStripSpeed({ groundSpeedKnots: Number.NaN })).toBe("-");
  expect(formatAircraftStripHeading({ trackDegrees: 359.6 })).toBe("000°");
  expect(formatAircraftStripHeading({ trackDegrees: Number.NaN })).toBe("-");
});
