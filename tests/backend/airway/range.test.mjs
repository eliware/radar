import { expect, test } from "@jest/globals";
import { pathInRange } from "../../../src/backend/airway/range.mjs";

test("selects a single fix inside the requested distance band", () => {
  expect(pathInRange([{ rangeNm: 10 }], 5, 20)).toBe(true);
  expect(pathInRange([{ rangeNm: 30 }], 5, 20)).toBe(false);
});

test("selects connected paths crossing the range band", () => {
  expect(
    pathInRange(
      [
        { x: -30, z: 0, rangeNm: 30 },
        { x: 30, z: 0, rangeNm: 30 },
      ],
      10,
      20,
    ),
  ).toBe(true);
  expect(
    pathInRange(
      [
        { x: -30, z: 30, rangeNm: 42 },
        { x: 30, z: 30, rangeNm: 42 },
      ],
      10,
      20,
    ),
  ).toBe(false);
  expect(
    pathInRange(
      [
        { x: 0, z: 0, rangeNm: 0 },
        { x: 0, z: 0, rangeNm: 10 },
      ],
      5,
      20,
    ),
  ).toBe(true);
});
