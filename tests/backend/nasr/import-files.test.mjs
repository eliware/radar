import { expect, jest, test } from "@jest/globals";
import { createNasrImportFiles } from "../../../src/backend/nasr/import-files.mjs";

test("provides default filesystem operations", () => {
  const files = createNasrImportFiles();
  expect(files.exists).toEqual(expect.any(Function));
  expect(files.temporaryPath("NASR.sqlite")).toMatch(/NASR\.sqlite\.tmp-\d+$/);
});

test("wraps output preparation, copy, replacement, and temporary cleanup", () => {
  const operations = {
    exists: jest.fn(() => true),
    copy: jest.fn(),
    mkdir: jest.fn(),
    rename: jest.fn(),
    remove: jest.fn(),
  };
  const files = createNasrImportFiles(operations);
  files.prepareOutput("/tmp/nasr/NASR.sqlite");
  const temporary = files.temporaryPath("/tmp/nasr/NASR.sqlite");
  files.copyInput("source.sqlite", temporary);
  files.install(temporary, "/tmp/nasr/NASR.sqlite");
  files.cleanup(temporary);
  expect(files.exists("source.sqlite")).toBe(true);
  expect(operations.mkdir).toHaveBeenCalledWith("/tmp/nasr", { recursive: true });
  expect(operations.copy).toHaveBeenCalledWith("source.sqlite", temporary);
  expect(operations.rename).toHaveBeenCalledWith(temporary, "/tmp/nasr/NASR.sqlite");
  expect(operations.remove).toHaveBeenCalledWith(temporary, { force: true });
});
