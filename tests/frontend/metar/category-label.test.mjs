import { expect, test } from "@jest/globals";
import { metarCategoryLabel } from "../../../src/frontend/metar/category-label.mjs";

test("renders a known flight category label", () => {
  expect(metarCategoryLabel("IFR")).toBe(
    '<span class="flight-category flight-category-ifr">IFR</span>',
  );
});

test("renders a placeholder for unknown categories", () => {
  expect(metarCategoryLabel("unknown")).toBe("—");
});
