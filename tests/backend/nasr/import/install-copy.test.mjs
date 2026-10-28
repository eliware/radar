import { expect, jest, test } from "@jest/globals";
import { createNasrImportFiles } from "../../../../src/backend/nasr/import/files.mjs";
import { installNasrCopy } from "../../../../src/backend/nasr/import/install-copy.mjs";
import { createNasrImportTemporaryFile } from "../../../../src/backend/nasr/import/temporary-file.mjs";

function createFiles() {
  const operations = {
    exists: jest.fn(() => true),
    copy: jest.fn(),
    mkdir: jest.fn(),
    rename: jest.fn(),
    remove: jest.fn(),
  };
  return {
    operations,
    files: createNasrImportTemporaryFile(createNasrImportFiles(operations)),
  };
}

test("prepares a temporary copy before installing it atomically", () => {
  const { operations, files } = createFiles();
  expect(installNasrCopy(files, "source.sqlite", "/tmp/NASR.sqlite", () => 4)).toBe(4);
  expect(operations.copy).toHaveBeenCalledWith("source.sqlite", expect.stringContaining(".tmp-"));
  expect(operations.rename).toHaveBeenCalledWith(
    expect.stringContaining(".tmp-"),
    "/tmp/NASR.sqlite",
  );
});

test("removes the temporary copy if preparation fails", () => {
  const { operations, files } = createFiles();
  expect(() =>
    installNasrCopy(files, "source.sqlite", "/tmp/NASR.sqlite", () => {
      throw new Error("prepare failed");
    }),
  ).toThrow("prepare failed");
  expect(operations.remove).toHaveBeenCalledWith(expect.stringContaining(".tmp-"), {
    force: true,
  });
});
