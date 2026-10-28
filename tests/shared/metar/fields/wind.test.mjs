import { expect, test } from "@jest/globals";
import { windDirectionText } from "../../../../src/shared/metar/fields/wind.mjs";

test("formats wind direction", () => {
  expect(windDirectionText({ direction: "VRB" })).toBe("VRB");
  expect(windDirectionText({ degrees: 5 })).toBe("005°");
});
