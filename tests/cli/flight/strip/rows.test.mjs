import { expect, jest, test } from "@jest/globals";
import { aircraftRowsOf } from "../../../../src/cli/flight/strip/rows.mjs";

test("formats each aircraft using the supplied clock once per row", () => {
  const now = jest.fn(() => 4000);
  const rows = aircraftRowsOf([{ lastSeen: 1000 }, { lastSeen: 2000 }], now);
  expect(rows).toHaveLength(2);
  expect(rows[0].at(-1)).toBe("3s");
  expect(rows[1].at(-1)).toBe("2s");
  expect(now).toHaveBeenCalledTimes(2);
});

test("defaults to the current clock", () => {
  expect(aircraftRowsOf([])).toEqual([]);
});
