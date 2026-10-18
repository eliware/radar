import { expect, test } from "@jest/globals";
import { NASR_INDEXES } from "../../../src/backend/nasr/indexes.mjs";

test("defines unique indexes for each NASR query path", () => {
  const names = NASR_INDEXES.map((statement) => statement.match(/INDEX IF NOT EXISTS (\w+)/)[1]);
  expect(names).toHaveLength(18);
  expect(new Set(names).size).toBe(names.length);
});
