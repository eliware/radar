import { expect, jest, test } from "@jest/globals";
import { prepareNasrImportInstallation } from "../../../../../src/backend/nasr/import/prepare/install.mjs";

test("installs a prepared temporary database into the requested output", () => {
  const files = {
    mkdir: jest.fn(),
    copy: jest.fn(),
    rename: jest.fn(),
    remove: jest.fn(),
  };
  const Database = jest.fn();
  const prepare = jest.fn(() => 12);
  expect(
    prepareNasrImportInstallation(files, Database, "input.sqlite", "output/NASR.sqlite", prepare),
  ).toBe(12);
  expect(files.mkdir).toHaveBeenCalledWith("output", { recursive: true });
  expect(files.copy).toHaveBeenCalledWith(
    "input.sqlite",
    expect.stringContaining("NASR.sqlite.tmp-"),
  );
  const temporary = files.copy.mock.calls[0][1];
  expect(prepare).toHaveBeenCalledWith(Database, temporary);
  expect(files.rename).toHaveBeenCalledWith(temporary, "output/NASR.sqlite");
  expect(files.remove).not.toHaveBeenCalled();
});
