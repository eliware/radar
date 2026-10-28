import { resolve } from "node:path";
import { expect, jest, test } from "@jest/globals";
import { DEFAULT_OUTPUT } from "../../../../src/backend/nasr/output-path.mjs";
import { validateNasrImportPaths } from "../../../../src/backend/nasr/import/paths.mjs";

test("resolves existing input and output paths", () => {
  const exists = jest.fn(() => true);
  expect(validateNasrImportPaths("source.sqlite", "target.sqlite", exists)).toEqual({
    input: resolve("source.sqlite"),
    output: resolve("target.sqlite"),
  });
  expect(exists).toHaveBeenCalledWith(resolve("source.sqlite"));
});

test("uses the default output when none is supplied", () => {
  expect(validateNasrImportPaths("source.sqlite", undefined, () => true).output).toBe(
    resolve(DEFAULT_OUTPUT),
  );
});

test("rejects missing input paths and equal input and output paths", () => {
  expect(() => validateNasrImportPaths("missing.sqlite", "out.sqlite", () => false)).toThrow(
    "Input NASR database not found",
  );
  expect(() => validateNasrImportPaths("same.sqlite", "same.sqlite", () => true)).toThrow(
    "paths must be different",
  );
});
