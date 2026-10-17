import { expect, test } from "@jest/globals";
import { hasUsefulCallsign, retainUsefulCallsign } from "../../../src/shared/aircraft/callsign.mjs";

test.each(["AD", "ok", " RM ", "unknown", "-", "", null, undefined])(
  "marks %s as unusable",
  (callsign) => {
    expect(hasUsefulCallsign(callsign)).toBe(false);
  },
);

test("keeps useful callsigns and accepts a new useful callsign", () => {
  expect(hasUsefulCallsign("BAW15K")).toBe(true);
  expect(retainUsefulCallsign("BAW15K", "RM")).toBe("BAW15K");
  expect(retainUsefulCallsign("RM", "BAW15K")).toBe("BAW15K");
});
