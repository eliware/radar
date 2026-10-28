import { expect, test } from "@jest/globals";
import { fahrenheitText } from "../../../../src/shared/metar/fields/temperature.mjs";

test("converts Celsius values to Fahrenheit", () => {
  expect(fahrenheitText(0)).toBe("32°F");
  expect(fahrenheitText(18)).toBe("64°F");
  expect(fahrenheitText(null)).toBe("—");
});
