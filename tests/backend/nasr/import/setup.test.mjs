import { resolve } from "node:path";
import { expect, jest, test } from "@jest/globals";
import { createNasrImportSetup } from "../../../../src/backend/nasr/import/setup.mjs";
import { DEFAULT_OUTPUT } from "../../../../src/backend/nasr/output-path.mjs";

test("assembles database, filesystem, and default output path dependencies", () => {
  const Database = jest.fn();
  const exists = jest.fn(() => true);
  const setup = createNasrImportSetup("source.sqlite", undefined, { Database, exists });
  expect(setup).toEqual({
    DatabaseConstructor: Database,
    filesystem: expect.objectContaining({ exists }),
    input: resolve("source.sqlite"),
    output: resolve(DEFAULT_OUTPUT),
  });
  expect(exists).toHaveBeenCalledWith(resolve("source.sqlite"));
});

test("rejects missing input during setup before starting the import lifecycle", () => {
  expect(() =>
    createNasrImportSetup("missing.sqlite", "output.sqlite", { exists: () => false }),
  ).toThrow("Input NASR database not found");
});
