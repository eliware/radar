import { expect, test } from "@jest/globals";
import { safeIlsElevation } from "../../src/frontend/safe-ils-elevation.mjs";

test("uses zero elevation when the point has no finite elevation", () => {
  expect(safeIlsElevation({ elevationFeet: 25 })).toBe(25);
  expect(safeIlsElevation({ elevationFeet: Number.NaN })).toBe(0);
});
