import { expect, jest, test } from "@jest/globals";
import { prepareNasrImportInstallation } from "../../../../../src/backend/nasr/import/prepare/install.mjs";

test("installs a prepared temporary database into the requested output", () => {
  const files = {
    prepareOutput: jest.fn(),
    temporaryPath: jest.fn(() => "output.sqlite.tmp"),
    copyInput: jest.fn(),
    install: jest.fn(),
    cleanup: jest.fn(),
  };
  const Database = jest.fn();
  const prepare = jest.fn(() => 12);
  expect(
    prepareNasrImportInstallation(files, Database, "input.sqlite", "output.sqlite", prepare),
  ).toBe(12);
  expect(files.prepareOutput).toHaveBeenCalledWith("output.sqlite");
  expect(files.copyInput).toHaveBeenCalledWith("input.sqlite", "output.sqlite.tmp");
  expect(prepare).toHaveBeenCalledWith(Database, "output.sqlite.tmp");
  expect(files.install).toHaveBeenCalledWith("output.sqlite.tmp", "output.sqlite");
  expect(files.cleanup).not.toHaveBeenCalled();
});
