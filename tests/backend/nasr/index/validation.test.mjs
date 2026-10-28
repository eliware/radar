import { DatabaseSync } from "node:sqlite";
import { expect, test } from "@jest/globals";
import { NASR_INDEXES } from "../../../../src/backend/nasr/index/definitions.mjs";
import { REQUIRED_COLUMNS } from "../../../../src/backend/nasr/required-columns.mjs";
import { verifyNasrIndexes } from "../../../../src/backend/nasr/index/validation.mjs";

test("verifies installed index definitions", () => {
  const database = new DatabaseSync(":memory:");
  for (const [table, names] of Object.entries(REQUIRED_COLUMNS)) {
    const columns = [...new Set(names.split(" "))].map((name) => `"${name}" TEXT`).join(", ");
    database.exec(`CREATE TABLE "${table}" (${columns})`);
  }
  expect(() => verifyNasrIndexes(database)).toThrow("radar_apt_location");
  for (const index of NASR_INDEXES) database.exec(index);
  expect(() => verifyNasrIndexes(database)).not.toThrow();
  database.close();
});
