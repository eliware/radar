import { expect, test } from "@jest/globals";
import { formatAircraftStripCallsign } from "../../../../src/shared/aircraft/strip/fields.mjs";

test("formats shared flight strip callsign", () => {
  expect(formatAircraftStripCallsign({ callsign: " TEST1 " })).toBe("TEST1");
  expect(formatAircraftStripCallsign({ callsign: "UNKNOWN", icao: "ABC123" })).toBe("ABC123");
  expect(formatAircraftStripCallsign({})).toBe("-");
});
