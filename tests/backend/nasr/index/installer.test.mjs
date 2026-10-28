import { expect, jest, test } from "@jest/globals";
import { installNasrIndexes } from "../../../../src/backend/nasr/index/installer.mjs";
import { NASR_INDEXES } from "../../../../src/backend/nasr/index/definitions.mjs";

test("installs declared indexes in a transaction and analyzes the database", () => {
  const database = { exec: jest.fn() };
  expect(installNasrIndexes(database)).toBe(NASR_INDEXES.length);
  expect(database.exec.mock.calls).toEqual(
    ["BEGIN", ...NASR_INDEXES, "COMMIT", "ANALYZE"].map((sql) => [sql]),
  );
});
