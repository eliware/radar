import { expect, jest, test } from "@jest/globals";
import { rowsWithinBounds } from "../../../../src/backend/reference/range/rows.mjs";

test("queries a bounded range and clamps latitude and longitude", () => {
  const statement = { all: jest.fn(() => []) };
  expect(rowsWithinBounds(statement, { latitude: 90, longitude: 180 }, 300)).toEqual([]);
  expect(statement.all).toHaveBeenCalledWith(85, 90, -180, 180);
});
