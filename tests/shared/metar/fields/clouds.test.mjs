import { expect, test } from "@jest/globals";
import { cloudText } from "../../../../src/shared/metar/fields/clouds.mjs";

test("formats cloud layers, vertical visibility, and CAVOK", () => {
  expect(cloudText({ clouds: [{ quantity: "FEW", height: 1200 }] })).toBe("FEW012");
  expect(cloudText({ clouds: [{ quantity: "BKN" }] })).toBe("BKN—");
  expect(cloudText({ verticalVisibility: 200, clouds: [] })).toBe("Vertical visibility");
  expect(cloudText({ clouds: [], cavok: true })).toBe("CAVOK");
  expect(cloudText({ clouds: [] })).toBe("—");
});
