import { expect, test } from "@jest/globals";
import { metarFlightCategory } from "../../../src/backend/metar/flight-category.mjs";

test.each([
  ["VFR", 6],
  ["MVFR", 5],
  ["MVFR", 3],
  ["IFR", 2.9],
  ["IFR", 1],
  ["LIFR", 0.9],
])("classifies visibility %s at %s miles", (expected, value) => {
  expect(metarFlightCategory({ visibility: { value }, clouds: [] })).toBe(expected);
});

test.each([
  ["VFR", 3001],
  ["MVFR", 3000],
  ["MVFR", 1000],
  ["IFR", 999],
  ["IFR", 500],
  ["LIFR", 499],
])("classifies ceiling %s at %s feet", (expected, height) => {
  expect(metarFlightCategory({ clouds: [{ quantity: "OVC", height }] })).toBe(expected);
});

test("uses the more restrictive ceiling or visibility category", () => {
  expect(
    metarFlightCategory({ visibility: { value: 10 }, clouds: [{ quantity: "BKN", height: 900 }] }),
  ).toBe("IFR");
  expect(
    metarFlightCategory({ visibility: { value: 2 }, clouds: [{ quantity: "BKN", height: 4000 }] }),
  ).toBe("IFR");
});

test("handles vertical visibility, clear sky, CAVOK, and missing data", () => {
  expect(metarFlightCategory({ verticalVisibility: 400, visibility: { value: 10 } })).toBe("LIFR");
  expect(metarFlightCategory({ visibility: { value: 10 }, clouds: [{ quantity: "FEW" }] })).toBe(
    "VFR",
  );
  expect(metarFlightCategory({ cavok: true })).toBe("VFR");
  expect(metarFlightCategory({})).toBeNull();
});
