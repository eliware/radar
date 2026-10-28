import { expect, test } from "@jest/globals";
import { timeText } from "../../../../src/shared/metar/fields/time.mjs";

test("formats METAR observation time and missing values", () => {
  expect(timeText({ day: 8, hour: 1, minute: 2 })).toBe("08 01:02Z");
  expect(timeText({})).toBe("—");
});
