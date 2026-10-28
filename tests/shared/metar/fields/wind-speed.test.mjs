import { expect, test } from "@jest/globals";
import { windSpeedText } from "../../../../src/shared/metar/fields/wind-speed.mjs";

test("formats wind speed and gust", () => {
  expect(windSpeedText({ speed: 12, gust: 20 })).toBe("12G20");
  expect(windSpeedText({ speed: 12 })).toBe("12");
  expect(windSpeedText(null)).toBe("—");
});
