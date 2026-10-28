import { expect, test } from "@jest/globals";
import { visibilityText } from "../../../../src/shared/metar/fields/visibility.mjs";

test("formats visibility and vertical visibility", () => {
  expect(visibilityText({ visibility: { value: 6 } })).toBe("6");
  expect(visibilityText({ visibility: { indicator: ">", value: 6 } })).toBe(">6");
  expect(visibilityText({ verticalVisibility: 200 })).toBe("VV 200 ft");
  expect(visibilityText({})).toBe("—");
});
