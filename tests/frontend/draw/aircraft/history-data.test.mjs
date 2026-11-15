import { expect, test } from "@jest/globals";
import { getAircraftHistoryMarks } from "../../../../src/frontend/draw/aircraft/history-data.mjs";

test("excludes current and expired points and calculates opacity for retained history", () => {
  const now = 120_000;
  const fresh = { x: 1, recordedAt: now };
  const halfOld = { x: 2, recordedAt: now - 60_000 };
  const expired = { x: 3, recordedAt: now - 120_000 };
  const current = { x: 4, recordedAt: now };
  expect(
    getAircraftHistoryMarks([{ history: [fresh, halfOld, expired, current] }, {}], now),
  ).toEqual([
    { point: fresh, opacity: 1 },
    { point: halfOld, opacity: 0.5 },
  ]);
});

test("treats missing timestamps as fresh and clamps future timestamps", () => {
  const unknown = { x: 1 };
  const future = { x: 2, recordedAt: 2000 };
  expect(getAircraftHistoryMarks([{ history: [unknown, future] }], 1000)).toEqual([
    { point: unknown, opacity: 1 },
  ]);
});
