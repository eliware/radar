import { expect, test } from "@jest/globals";
import { decodeWaterTile } from "../../../../src/frontend/water/tile/decoder.mjs";

test("returns no paths when the vector tile has no water layer or features", () => {
  expect(
    decodeWaterTile(new Uint8Array([26, 11, 10, 5, 119, 97, 116, 101, 114, 18, 0, 120, 2]).buffer, {
      z: 1,
      x: 1,
      y: 1,
    }),
  ).toEqual([]);
  expect(decodeWaterTile(new ArrayBuffer(0), { z: 0, x: 0, y: 0 })).toEqual([]);
});
