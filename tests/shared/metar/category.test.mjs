import { expect, test } from "@jest/globals";
import { metarCategoryLabel, metarFlightCategory } from "../../../src/shared/metar/category.mjs";

test("renders only known flight category labels", () => {
  expect(metarCategoryLabel("IFR")).toBe(
    '<span class="flight-category flight-category-ifr">IFR</span>',
  );
  expect(metarCategoryLabel("unknown")).toBe("—");
});

test.each([
  ["VFR", { visibility: { value: 6 }, clouds: [] }],
  ["MVFR", { visibility: { value: 5 }, clouds: [] }],
  ["IFR", { visibility: { value: 2 }, clouds: [] }],
  ["LIFR", { visibility: { value: 0.5 }, clouds: [] }],
  ["IFR", { clouds: [{ quantity: "OVC", height: 900 }] }],
  ["VFR", { clouds: [{ quantity: "BKN", height: 4000 }] }],
  ["LIFR", { verticalVisibility: 400, visibility: { value: 10 } }],
  ["VFR", { cavok: true }],
  [null, {}],
])("classifies flight category %s", (expected, data) => {
  expect(metarFlightCategory(data)).toBe(expected);
});
