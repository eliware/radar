import { expect, test } from "@jest/globals";
import { isMetarCategory } from "../../../src/frontend/metar/category.mjs";

test("recognizes the supported flight categories", () => {
  expect(isMetarCategory("VFR")).toBe(true);
  expect(isMetarCategory("MVFR")).toBe(true);
  expect(isMetarCategory("IFR")).toBe(true);
  expect(isMetarCategory("LIFR")).toBe(true);
  expect(isMetarCategory("unknown")).toBe(false);
});
