import { expect, test } from "@jest/globals";
import { airportAirspaceBands } from "../../../src/frontend/airport-airspace/bands.mjs";

test("builds approximate Class B, C, and D altitude shelves", () => {
  const airport = { elevationFeet: 100, classB: "Y", classC: "Y", classD: "Y" };
  expect(airportAirspaceBands(airport)).toEqual([
    { innerRadiusNm: 0, outerRadiusNm: 10, floorFeet: 100, ceilingFeet: 10000 },
    { innerRadiusNm: 10, outerRadiusNm: 20, floorFeet: 3000, ceilingFeet: 10000 },
    { innerRadiusNm: 20, outerRadiusNm: 30, floorFeet: 6000, ceilingFeet: 10000 },
    { innerRadiusNm: 0, outerRadiusNm: 5, floorFeet: 100, ceilingFeet: 4100 },
    { innerRadiusNm: 5, outerRadiusNm: 10, floorFeet: 1300, ceilingFeet: 4100 },
    { innerRadiusNm: 0, outerRadiusNm: 5, floorFeet: 100, ceilingFeet: 2600 },
  ]);
});

test("returns no bands when an airport has no controlled airspace class", () => {
  expect(airportAirspaceBands({ elevationFeet: Number.NaN })).toEqual([]);
});
