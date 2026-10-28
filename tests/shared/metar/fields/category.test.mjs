import { expect, test } from "@jest/globals";
import { metarFlightCategory } from "../../../../src/shared/metar/fields/category.mjs";

test("calculates a category from both visibility and ceiling", () => {
  expect(
    metarFlightCategory({ visibility: { value: 6 }, clouds: [{ quantity: "OVC", height: 900 }] }),
  ).toBe("IFR");
});

test("uses CAVOK when visibility and ceiling are absent", () => {
  expect(metarFlightCategory({ cavok: true })).toBe("VFR");
});
