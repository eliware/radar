import { resolve } from "node:path";
import { expect, jest, test } from "@jest/globals";
import {
  selectNasrImportPaths,
  validateNasrImportPaths,
} from "../../../../src/backend/nasr/import/paths.mjs";

test("resolves existing input and output paths", () => {
  const exists = jest.fn(() => true);
  expect(validateNasrImportPaths("source.sqlite", "target.sqlite", exists)).toEqual({
    input: resolve("source.sqlite"),
    output: resolve("target.sqlite"),
  });
  expect(exists).toHaveBeenCalledWith(resolve("source.sqlite"));
});

test("selects and validates import paths as one path operation", () => {
  const exists = jest.fn(() => true);
  expect(selectNasrImportPaths("source.sqlite", "output.sqlite", exists)).toEqual({
    input: resolve("source.sqlite"),
    output: resolve("output.sqlite"),
  });
  expect(exists).toHaveBeenCalledWith(resolve("source.sqlite"));
});

test("rejects missing input paths and equal input and output paths", () => {
  expect(() => validateNasrImportPaths("missing.sqlite", "out.sqlite", () => false)).toThrow(
    "Input NASR database not found",
  );
  expect(() => validateNasrImportPaths("same.sqlite", "same.sqlite", () => true)).toThrow(
    "paths must be different",
  );
});

test("rejects an empty input path before checking the filesystem", () => {
  const exists = jest.fn();
  expect(() => validateNasrImportPaths("", "out.sqlite", exists)).toThrow(
    "Input NASR database not found",
  );
  expect(exists).not.toHaveBeenCalled();
});
