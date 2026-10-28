import { expect, jest, test } from "@jest/globals";
import { createNasrImportFiles } from "../../../../src/backend/nasr/import/files.mjs";

test("provides default filesystem operations", () => {
  const files = createNasrImportFiles();
  for (const operation of ["exists", "copy", "mkdir", "rename", "remove"])
    expect(files[operation]).toEqual(expect.any(Function));
});

test("provides injected filesystem operations", () => {
  const operations = {
    exists: jest.fn(() => true),
    copy: jest.fn(),
    mkdir: jest.fn(),
    rename: jest.fn(),
    remove: jest.fn(),
  };
  const files = createNasrImportFiles(operations);
  expect(files).toEqual(operations);
});
