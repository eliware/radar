import { expect, test } from "@jest/globals";
import { NASR_INDEXES } from "../../../../src/backend/nasr/indexes.mjs";
import { verifyNasrQueryPlans } from "../../../../src/backend/nasr/query/plans.mjs";

test("checks representative plans use their Radar indexes", () => {
  const database = {
    prepare: () => ({ all: () => [] }),
  };
  expect(() => verifyNasrQueryPlans(database)).toThrow("does not use radar_apt_location");
});

test("accepts plans containing the expected indexes", () => {
  const plan = NASR_INDEXES.map((sql) => {
    const [, name] = sql.match(/INDEX IF NOT EXISTS (\w+)/);
    return `USING INDEX ${name}`;
  }).join(" ");
  const database = {
    prepare: () => ({ all: () => [{ detail: plan }] }),
  };
  expect(() => verifyNasrQueryPlans(database)).not.toThrow();
});
