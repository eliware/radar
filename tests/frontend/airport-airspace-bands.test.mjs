import { expect, test } from "@jest/globals";
import {
  airportAirspaceBands,
  airportAirspaceEdges,
} from "../../src/frontend/airport-airspace-bands.mjs";

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

test("draws only exposed shelf rings and walls for overlapping bands", () => {
  const bands = [
    { innerRadiusNm: 0, outerRadiusNm: 10, floorFeet: 100, ceilingFeet: 1000 },
    { innerRadiusNm: 10, outerRadiusNm: 20, floorFeet: 500, ceilingFeet: 1000 },
  ];

  expect(airportAirspaceEdges(bands, 100)).toEqual({
    rings: [
      { radius: 10, altitude: 500 },
      { radius: 20, altitude: 500 },
      { radius: 20, altitude: 1000 },
    ],
    walls: [
      { radius: 10, floor: 100, ceiling: 500 },
      { radius: 20, floor: 500, ceiling: 1000 },
    ],
  });
});

test("joins disjoint exposed ring ranges and skips zero-radius edges", () => {
  const edges = airportAirspaceEdges(
    [
      { innerRadiusNm: -5, outerRadiusNm: 0, floorFeet: 0, ceilingFeet: 100 },
      { innerRadiusNm: 5, outerRadiusNm: 10, floorFeet: 0, ceilingFeet: 100 },
    ],
    -1,
  );

  expect(edges.rings).toEqual([
    { radius: 5, altitude: 0 },
    { radius: 10, altitude: 0 },
    { radius: 5, altitude: 100 },
    { radius: 10, altitude: 100 },
  ]);
  expect(edges.walls).toEqual([
    { radius: 5, floor: 0, ceiling: 100 },
    { radius: 10, floor: 0, ceiling: 100 },
  ]);
});
