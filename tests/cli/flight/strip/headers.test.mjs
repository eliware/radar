import { expect, test } from "@jest/globals";
import { selectFlightStripHeaders } from "../../../../src/cli/flight/strip/headers.mjs";

test("selects full or compact labels for every flight strip column", () => {
  expect(selectFlightStripHeaders(true)).toEqual([
    "CALLSIGN",
    "ICAO",
    "ALTITUDE",
    "SPEED",
    "HEADING",
    "VERTICAL RATE",
    "SQUAWK",
    "POSITION",
    "RANGE NM",
    "BEARING",
    "AGE",
  ]);
  expect(selectFlightStripHeaders(false)).toEqual([
    "CALL",
    "ICAO",
    "ALT",
    "SPD",
    "HDG",
    "VS",
    "SQ",
    "POS",
    "RNG",
    "BRG",
    "AGE",
  ]);
});
