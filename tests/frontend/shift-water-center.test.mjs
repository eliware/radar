import { expect, test } from "@jest/globals";
import { shiftWaterCenter } from "../../src/frontend/shift-water-center.mjs";

test("shifts the tile center by local east and north distances", () => {
  expect(shiftWaterCenter({ latitude: 40, longitude: -70 }, 0, 60)).toEqual({
    latitude: 41,
    longitude: -70,
  });
  expect(shiftWaterCenter({ latitude: 40, longitude: -70 }, 60, 0).longitude).toBeCloseTo(-68.6946);
});

test("returns no center when home is not set", () => {
  expect(shiftWaterCenter(null, 1, 1)).toBeNull();
});
