import { expect, test } from "@jest/globals";
import { projectWaterTileRange } from "../../../../src/frontend/water/tile/projection.mjs";

test("projects geographic ranges into tile indices", () => {
  expect(projectWaterTileRange(-10, 10, -10, 10, 2)).toEqual({
    minX: 1,
    maxX: 2,
    minY: 1,
    maxY: 2,
  });
});
