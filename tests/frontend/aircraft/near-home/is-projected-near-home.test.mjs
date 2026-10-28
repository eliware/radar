import { expect, test } from "@jest/globals";
import { isAircraftProjectedNearHome } from "../../../../src/frontend/aircraft/near-home/is-projected-near-home.mjs";

test("rejects missing aircraft data before projecting a path", () => {
  expect(isAircraftProjectedNearHome(null, { latitude: 43, longitude: -70 })).toBe(false);
});
