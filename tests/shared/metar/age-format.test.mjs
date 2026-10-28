import { expect, test } from "@jest/globals";
import { formatMetarAge } from "../../../src/shared/metar/age-format.mjs";

test("formats minute and hour METAR ages", () => {
  const now = new Date("2026-10-13T18:00:00Z");
  expect(formatMetarAge("13 17:50Z", now)).toBe("10m");
  expect(formatMetarAge("13 16:50Z", now)).toBe("1h10m");
  expect(formatMetarAge("12 23:00Z", now)).toBe("19h");
});

test("formats invalid and future observations", () => {
  const now = new Date("2026-10-13T18:00:00Z");
  expect(formatMetarAge("13 23:00Z", now)).toBe("0m");
  expect(formatMetarAge("bad", now)).toBe("—");
  expect(formatMetarAge(null, now)).toBe("—");
  expect(formatMetarAge("bad")).toBe("—");
});
