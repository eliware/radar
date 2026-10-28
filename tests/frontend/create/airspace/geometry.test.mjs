import { expect, test } from "@jest/globals";
import { createAirspaceVertices } from "../../../../src/frontend/create/airspace/geometry.mjs";

test("builds ring and wall vertices relative to the home elevation", () => {
  const vertices = createAirspaceVertices(
    {
      rings: [{ radius: 2, altitude: 6076.12 }],
      walls: [{ radius: 1, floor: 0, ceiling: 6076.12 }],
    },
    { x: 10, z: 20 },
    0,
  );

  expect(vertices).toHaveLength((64 * 2 + 8 * 2) * 3);
  expect(vertices.slice(0, 3)).toEqual([12, 1, 20]);
  expect(vertices.slice(64 * 2 * 3, 64 * 2 * 3 + 6)).toEqual([11, 0, 20, 11, 1, 20]);
});
