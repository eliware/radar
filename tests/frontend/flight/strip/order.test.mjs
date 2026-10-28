import { expect, test } from "@jest/globals";
import { orderFlightStripAircraft } from "../../../../src/frontend/flight/strip/order.mjs";

test("orders aircraft by distance and preserves missing ranges last", () => {
  const aircraft = [
    { id: "missing" },
    { id: "near", distanceNauticalMiles: 2 },
    { id: "far", distanceNauticalMiles: 9 },
    { id: "also-missing" },
  ];
  expect(orderFlightStripAircraft(aircraft).map(({ id }) => id)).toEqual([
    "near",
    "far",
    "missing",
    "also-missing",
  ]);
  expect(aircraft.map(({ id }) => id)).toEqual(["missing", "near", "far", "also-missing"]);
});

test("uses input order for equal distances", () => {
  const aircraft = [
    { id: "first", distanceNauticalMiles: 2 },
    { id: "second", distanceNauticalMiles: 2 },
  ];
  expect(orderFlightStripAircraft(aircraft).map(({ id }) => id)).toEqual(["first", "second"]);
});
