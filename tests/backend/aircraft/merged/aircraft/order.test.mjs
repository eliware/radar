import { expect, test } from "@jest/globals";
import { compareAircraftDistance } from "../../../../../src/backend/aircraft/merged/aircraft/order.mjs";

test("sorts by distance and places missing distances last", () => {
  expect(compareAircraftDistance({ distanceNauticalMiles: 2 }, { distanceNauticalMiles: 4 })).toBe(
    -2,
  );
  expect(compareAircraftDistance({ distanceNauticalMiles: 2 }, {})).toBeLessThan(0);
  expect(compareAircraftDistance({}, { distanceNauticalMiles: 2 })).toBeGreaterThan(0);
  expect(compareAircraftDistance({}, {})).toBeNaN();
});
