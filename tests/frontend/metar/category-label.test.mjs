import { expect, test } from "@jest/globals";
import { metarCategoryLabel } from "../../../src/frontend/metar/category-label.mjs";

test("renders only known flight category labels", () => {
  expect(metarCategoryLabel("IFR")).toBe(
    '<span class="flight-category flight-category-ifr">IFR</span>',
  );
  expect(metarCategoryLabel("unknown")).toBe("—");
});
