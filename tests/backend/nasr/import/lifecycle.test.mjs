import { expect, jest, test } from "@jest/globals";
import { default as completeNasrImportLifecycle } from "../../../../src/backend/nasr/import/lifecycle.mjs";

test("validates the source before preparing and installing output", () => {
  const Database = jest.fn();
  const filesystem = { rename: jest.fn() };
  const input = "/data/input.sqlite";
  const output = "/data/output.sqlite";
  const calls = [];
  const validateSource = jest.fn((...args) => calls.push(["validate", ...args]));
  const prepareInstallation = jest.fn((...args) => (calls.push(["prepare", ...args]), 12));
  expect(
    completeNasrImportLifecycle(Database, filesystem, input, output, {
      validateSource,
      prepareInstallation,
    }),
  ).toEqual({ output, indexes: 12 });
  expect(calls).toEqual([
    ["validate", Database, input],
    ["prepare", filesystem, Database, input, output],
  ]);
});
