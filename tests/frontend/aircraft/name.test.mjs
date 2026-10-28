import { expect, test } from "@jest/globals";
import { formatAircraftName } from "../../../src/frontend/aircraft/name.mjs";

test("uses a trimmed useful callsign as the aircraft name", () => {
  expect(formatAircraftName({ callsign: " TEST ", icao: "ABC123" })).toBe("TEST");
  expect(formatAircraftName({ callsign: "AAL174" })).toBe("AAL174");
});

test("falls back to the ICAO address for unusable callsigns", () => {
  expect(formatAircraftName({ callsign: "OK", icao: "ABC123" })).toBe("ABC123");
  expect(formatAircraftName({ callsign: "rm", icao: "DEF456" })).toBe("DEF456");
  expect(formatAircraftName({ callsign: "AD", icao: "A1B2C3" })).toBe("A1B2C3");
  expect(formatAircraftName({ callsign: "Unknown", icao: "FEDCBA" })).toBe("FEDCBA");
  expect(formatAircraftName({})).toBe("-");
});
