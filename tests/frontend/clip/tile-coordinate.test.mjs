import { expect, test } from "@jest/globals";
import { tilePointToCoordinate } from "../../../src/frontend/clip/tile-coordinate.mjs";

test("converts tile corners to geographic coordinates", () => {
  expect(tilePointToCoordinate({ x: 0, y: 0 }, { z: 0, x: 0, y: 0 }, 256)).toEqual({
    longitude: -180,
    latitude: expect.closeTo(85.0511287798066),
  });
  expect(tilePointToCoordinate({ x: 256, y: 256 }, { z: 0, x: 0, y: 0 }, 256)).toEqual({
    longitude: 180,
    latitude: expect.closeTo(-85.0511287798066),
  });
});
