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

test.each([
  ["VFR", { visibility: { value: 6 }, clouds: [] }],
  ["MVFR", { visibility: { value: 5 }, clouds: [] }],
  ["IFR", { visibility: { value: 2 }, clouds: [] }],
  ["LIFR", { visibility: { value: 0.5 }, clouds: [] }],
  ["IFR", { clouds: [{ quantity: "OVC", height: 900 }] }],
  ["MVFR", { clouds: [{ quantity: "BKN", height: 2000 }] }],
  ["VFR", { clouds: [{ quantity: "BKN", height: 4000 }] }],
  ["LIFR", { verticalVisibility: 400, visibility: { value: 10 } }],
  ["VFR", { cavok: true }],
  [null, {}],
])("classifies flight category %s", (expected, data) => {
  expect(metarFlightCategory(data)).toBe(expected);
});
