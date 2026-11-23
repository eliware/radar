import { resolve } from "node:path";
import { expect, jest, test } from "@jest/globals";
import { default as selectNasrImportPaths } from "../../../../src/backend/nasr/import/paths.mjs";
import { DEFAULT_OUTPUT } from "../../../../src/backend/nasr/output-path.mjs";

test("resolves an existing input and selects the default output path", () => {
  const exists = jest.fn(() => true);
  expect(selectNasrImportPaths("source.sqlite", undefined, exists)).toEqual({
    input: resolve("source.sqlite"),
    output: resolve(DEFAULT_OUTPUT),
  });
  expect(exists).toHaveBeenCalledWith(resolve("source.sqlite"));
});

test("rejects missing input paths and equal input and output paths", () => {
  expect(() => selectNasrImportPaths("missing.sqlite", "out.sqlite", () => false)).toThrow(
    "Input NASR database not found",
  );
  expect(() => selectNasrImportPaths("same.sqlite", "same.sqlite", () => true)).toThrow(
    "paths must be different",
  );
});

test("rejects an empty input path before checking the filesystem", () => {
  const exists = jest.fn();
  expect(() => selectNasrImportPaths("", "out.sqlite", exists)).toThrow(
    "Input NASR database not found",
  );
  expect(exists).not.toHaveBeenCalled();
});
