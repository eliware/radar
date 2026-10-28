import { expect, test } from "@jest/globals";
import { NASR_INDEXES } from "../../../../src/backend/nasr/index/definitions.mjs";

test("defines unique indexes for each NASR query path", () => {
  const names = NASR_INDEXES.map((statement) => statement.match(/INDEX IF NOT EXISTS (\w+)/)[1]);
  expect(names).toHaveLength(19);
  expect(new Set(names).size).toBe(names.length);
  expect(NASR_INDEXES.join("\n")).toContain(
    "radar_navaid_procedure_join ON NAV_BASE(NAV_ID, NAV_TYPE)",
  );
});
