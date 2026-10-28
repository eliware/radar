import { expect, test } from "@jest/globals";
import { validateNasrImportQueryPlans } from "../../../../src/backend/nasr/import/query-plan-validation.mjs";

test("reports a required index missing from a query plan", () => {
  const database = { prepare: () => ({ all: () => [] }) };
  expect(() => validateNasrImportQueryPlans(database)).toThrow(
    "NASR airports query plan does not use radar_apt_location.",
  );
});
