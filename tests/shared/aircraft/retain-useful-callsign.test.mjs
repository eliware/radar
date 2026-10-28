import { expect, test } from "@jest/globals";
import { retainUsefulCallsign } from "../../../src/shared/aircraft/retain-useful-callsign.mjs";

test("keeps a useful previous callsign when the incoming callsign is unusable", () => {
  expect(retainUsefulCallsign("BAW15K", "RM")).toBe("BAW15K");
});

test("accepts a useful incoming callsign", () => {
  expect(retainUsefulCallsign("RM", "BAW15K")).toBe("BAW15K");
});
