import { resolve } from "node:path";
import { expect, jest, test } from "@jest/globals";
import { selectNasrImportPaths } from "../../../../src/backend/nasr/import/select-paths.mjs";

test("selects and validates import paths as one path operation", () => {
  const exists = jest.fn(() => true);
  expect(selectNasrImportPaths("source.sqlite", "output.sqlite", exists)).toEqual({
    input: resolve("source.sqlite"),
    output: resolve("output.sqlite"),
  });
  expect(exists).toHaveBeenCalledWith(resolve("source.sqlite"));
});
