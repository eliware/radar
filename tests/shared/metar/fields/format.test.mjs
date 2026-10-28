import { expect, test } from "@jest/globals";
import {
  cloudText,
  conditionText,
  fahrenheitText,
  timeText,
  visibilityText,
  windDirectionText,
  windSpeedText,
} from "../../../../src/shared/metar/fields/format.mjs";

test("formats individual METAR report values", () => {
  expect(timeText({ day: 8, hour: 1, minute: 2 })).toBe("08 01:02Z");
  expect(windDirectionText({ direction: "VRB" })).toBe("VRB");
  expect(windSpeedText({ speed: 12, gust: 20 })).toBe("12G20");
  expect(visibilityText({ visibility: { value: 6 } })).toBe("6");
  expect(conditionText([{ intensity: "+", descriptive: "SH", phenomenons: ["RA"] }])).toBe("+SHRA");
  expect(cloudText({ clouds: [{ quantity: "FEW", height: 1200 }] })).toBe("FEW012");
  expect(fahrenheitText(0)).toBe("32°F");
});
