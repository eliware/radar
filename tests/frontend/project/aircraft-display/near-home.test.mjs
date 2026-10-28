import { expect, test } from "@jest/globals";
import { isAircraftDisplayNearHome } from "../../../../src/frontend/project/aircraft-display/near-home.mjs";

const home = { latitude: 43, longitude: -70 };

test("handles a missing aircraft item", () => {
  expect(isAircraftDisplayNearHome(null, home, 0)).toBe(false);
});
