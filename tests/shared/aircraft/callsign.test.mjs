import { expect, test } from "@jest/globals";
import { hasUsefulCallsign } from "../../../src/shared/aircraft/callsign.mjs";

test.each(["AD", "ok", " RM ", "unknown", "-", "", null, undefined])(
  "marks %s as unusable",
  (callsign) => {
    expect(hasUsefulCallsign(callsign)).toBe(false);
  },
);

test("recognizes useful callsigns", () => {
  expect(hasUsefulCallsign("BAW15K")).toBe(true);
});
