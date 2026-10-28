import { expect, test } from "@jest/globals";
import { windDirectionText, windSpeedText } from "../../../../src/shared/metar/fields/wind.mjs";

test("formats wind direction, speed, and gusts", () => {
  expect(windDirectionText({ direction: "VRB" })).toBe("VRB");
  expect(windDirectionText({ degrees: 5 })).toBe("005°");
  expect(windSpeedText({ speed: 12, gust: 20 })).toBe("12G20");
  expect(windSpeedText({ speed: 12 })).toBe("12");
  expect(windSpeedText(null)).toBe("—");
});
