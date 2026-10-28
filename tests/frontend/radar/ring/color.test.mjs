import { expect, test } from "@jest/globals";
import { getRadarRingColor } from "../../../../src/frontend/radar/ring/color.mjs";

test("selects ring colors based on connection and ring importance", () => {
  expect(getRadarRingColor(true, true)).toBe(0x006b26);
  expect(getRadarRingColor(true, false)).toBe(0x003814);
  expect(getRadarRingColor(false, true)).toBe(0x3a3a3a);
  expect(getRadarRingColor(false, false)).toBe(0x202020);
});
