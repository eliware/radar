import { expect, jest, test } from "@jest/globals";
import {
  mapReferenceInRange,
  rowsWithinBounds,
} from "../../../src/backend/reference/range-query.mjs";

test("queries a bounded range and clamps latitude and longitude", () => {
  const statement = { all: jest.fn(() => []) };
  expect(rowsWithinBounds(statement, { latitude: 90, longitude: 180 }, 300)).toEqual([]);
  expect(statement.all).toHaveBeenCalledWith(85, 90, -180, 180);
});

test("maps valid references and rejects invalid or out-of-range coordinates", () => {
  const location = { latitude: 0, longitude: 0 };
  expect(mapReferenceInRange({ latitude: 0.1, longitude: 0 }, location, 5, 20).rangeNm).toBeCloseTo(
    6,
  );
  expect(mapReferenceInRange({ latitude: 0, longitude: Number.NaN }, location, 0, 20)).toBeNull();
  expect(mapReferenceInRange({ latitude: 0, longitude: 0 }, location, 5, 20)).toBeNull();
  expect(mapReferenceInRange({ latitude: 1, longitude: 0 }, location, 0, 20)).toBeNull();
});
