import { expect, test } from "@jest/globals";
import { airportAirspaceBands } from "../../../src/frontend/airport-airspace/bands.mjs";
import { airportAirspaceEdges } from "../../../src/frontend/airport-airspace/edges.mjs";

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

test("exposes the same plan-view airport radii for Canvas and 3D renderers", () => {
  const airport = { elevationFeet: 100, classC: "Y" };
  const { rings } = airportAirspaceEdges(airportAirspaceBands(airport), airport.elevationFeet);
  expect(new Set(rings.map(({ radius }) => radius))).toEqual(new Set([5, 10]));
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
