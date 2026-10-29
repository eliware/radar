import { resolve } from "node:path";
import { expect, jest, test } from "@jest/globals";
import { selectNasrImportPaths } from "../../../../src/backend/nasr/import/select-paths.mjs";
import { DEFAULT_OUTPUT } from "../../../../src/backend/nasr/output-path.mjs";

test("selects the default output path when none is provided", () => {
  const exists = jest.fn(() => true);
  expect(selectNasrImportPaths("source.sqlite", undefined, exists)).toEqual({
    input: resolve("source.sqlite"),
    output: resolve(DEFAULT_OUTPUT),
  });
  expect(exists).toHaveBeenCalledWith(resolve("source.sqlite"));
});
