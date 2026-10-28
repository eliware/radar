import { expect, test } from "@jest/globals";
import { conditionText } from "../../../../src/shared/metar/fields/conditions.mjs";

test("formats METAR weather conditions", () => {
  expect(conditionText([{ intensity: "+", descriptive: "SH", phenomenons: ["RA"] }])).toBe("+SHRA");
  expect(conditionText([{ phenomenons: ["RA"] }])).toBe("RA");
  expect(conditionText([])).toBe("—");
});
